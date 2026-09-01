#!/usr/bin/env python3
"""Restyle 简历包 without changing wording. Align dates; highlight headings."""

from __future__ import annotations

import copy
import re
import shutil
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
NSMAP = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "w14": "http://schemas.microsoft.com/office/word/2010/wordml",
}
for prefix, uri in NSMAP.items():
    ET.register_namespace(prefix, uri)
ET.register_namespace("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006")
ET.register_namespace("o", "urn:schemas-microsoft-com:office:office")
ET.register_namespace("m", "http://schemas.openxmlformats.org/officeDocument/2006/math")
ET.register_namespace("v", "urn:schemas-microsoft-com:vml")
ET.register_namespace("wp", "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing")
ET.register_namespace("w10", "urn:schemas-microsoft-com:office:word")
ET.register_namespace("wne", "http://schemas.microsoft.com/office/word/2006/wordml")
ET.register_namespace("sl", "http://schemas.openxmlformats.org/schemaLibrary/2006/main")
ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
ET.register_namespace("pic", "http://schemas.openxmlformats.org/drawingml/2006/picture")
ET.register_namespace("wps", "http://schemas.microsoft.com/office/word/2010/wordprocessingShape")
ET.register_namespace("wpg", "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup")
ET.register_namespace("w15", "http://schemas.microsoft.com/office/word/2012/wordml")
ET.register_namespace("w16", "http://schemas.microsoft.com/office/word/2018/wordml")
ET.register_namespace("w16cex", "http://schemas.microsoft.com/office/word/2018/wordml/cex")
ET.register_namespace("w16cid", "http://schemas.microsoft.com/office/word/2016/wordml/cid")
ET.register_namespace("cr", "http://schemas.microsoft.com/office/comments/2020/reactions")

SAND = "EDE8E1"  # SSENSE-like warm sand
SAND_DEEP = "E4DDD4"
INK = "111111"
MUTED = "6B6B6B"
HAIR = "1A1A1A"
PAGE = "FAF9F7"
LINK = "1A1A1A"

# A4 11900 x 16840 twips. Content width with 540 L/R margins.
MARGIN = 540
PAGE_W = 11900
RIGHT_TAB = PAGE_W - MARGIN - MARGIN  # 10820

SECTIONS = {
    "核心能力",
    "工作经历",
    "实习经历",
    "教育经历",
    "项目经历与田野经历",
}

DATE_RE = re.compile(
    r"^(?P<title>.*?)(?P<pad>\s{2,})(?P<date>\d{4}年\s*\d{1,2}月\s*[-–—]\s*\d{4}年\s*\d{1,2}月)\s*$"
)


def q(tag: str) -> str:
    return f"{W}{tag}"


def local(el: ET.Element) -> str:
    return el.tag.split("}")[-1]


def para_text(p: ET.Element) -> str:
    return "".join(t.text or "" for t in p.iter(q("t")))


def has_drawing(p: ET.Element) -> bool:
    return p.find(".//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}anchor") is not None


def set_attr(el: ET.Element, name: str, value: str) -> None:
    el.set(q(name), value)


def ensure_ppr(p: ET.Element) -> ET.Element:
    ppr = p.find(q("pPr"))
    if ppr is None:
        ppr = ET.Element(q("pPr"))
        p.insert(0, ppr)
    return ppr


def upsert_child(parent: ET.Element, tag: str) -> ET.Element:
    el = parent.find(q(tag))
    if el is None:
        el = ET.SubElement(parent, q(tag))
    return el


def clear_tag(parent: ET.Element, tag: str) -> None:
    for el in list(parent.findall(q(tag))):
        parent.remove(el)


def rpr_base(size: str = "18", bold: bool = False, color: str = INK, italic: bool = False) -> ET.Element:
    rpr = ET.Element(q("rPr"))
    fonts = ET.SubElement(rpr, q("rFonts"))
    for k in ("ascii", "hAnsi", "eastAsia", "cs"):
        fonts.set(q(k), "Microsoft Yahei")
    if bold:
        ET.SubElement(rpr, q("b")).set(q("val"), "1")
        ET.SubElement(rpr, q("bCs")).set(q("val"), "1")
    if italic:
        ET.SubElement(rpr, q("i")).set(q("val"), "1")
        ET.SubElement(rpr, q("iCs")).set(q("val"), "1")
    ET.SubElement(rpr, q("color")).set(q("val"), color)
    ET.SubElement(rpr, q("sz")).set(q("val"), size)
    ET.SubElement(rpr, q("szCs")).set(q("val"), size)
    return rpr


def make_run(text: str, size: str = "18", bold: bool = False, color: str = INK, italic: bool = False) -> ET.Element:
    r = ET.Element(q("r"))
    r.append(rpr_base(size=size, bold=bold, color=color, italic=italic))
    t = ET.SubElement(r, q("t"))
    if text[:1].isspace() or text[-1:].isspace() or "  " in text:
        t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    t.text = text
    return r


def make_tab_run(size: str = "18", bold: bool = False, color: str = INK) -> ET.Element:
    r = ET.Element(q("r"))
    r.append(rpr_base(size=size, bold=bold, color=color))
    ET.SubElement(r, q("tab"))
    return r


def style_ppr(
    p: ET.Element,
    *,
    size: str = "18",
    bold: bool = False,
    before: str = "0",
    after: str = "40",
    line: str = "240",
    fill: str | None = None,
    right_tab: bool = False,
    border_bottom: bool = False,
    keep_next: bool = False,
    indent_left: str | None = None,
) -> ET.Element:
    ppr = ensure_ppr(p)
    # drop PDF leftovers that fight the new layout
    for tag in ("pBdr", "tabs", "shd", "spacing", "ind", "jc", "pStyle"):
        clear_tag(ppr, tag)

    if keep_next:
        kn = upsert_child(ppr, "keepNext")
        kn.set(q("val"), "1")

    if border_bottom:
        pBdr = ET.SubElement(ppr, q("pBdr"))
        bottom = ET.SubElement(pBdr, q("bottom"))
        bottom.set(q("val"), "single")
        bottom.set(q("sz"), "6")
        bottom.set(q("space"), "1")
        bottom.set(q("color"), HAIR)

    if fill:
        shd = ET.SubElement(ppr, q("shd"))
        shd.set(q("val"), "clear")
        shd.set(q("color"), "auto")
        shd.set(q("fill"), fill)

    if right_tab:
        tabs = ET.SubElement(ppr, q("tabs"))
        tab = ET.SubElement(tabs, q("tab"))
        tab.set(q("val"), "right")
        tab.set(q("leader"), "none")
        tab_pos = RIGHT_TAB - 80 if fill else RIGHT_TAB
        tab.set(q("pos"), str(tab_pos))

    sp = ET.SubElement(ppr, q("spacing"))
    sp.set(q("before"), before)
    sp.set(q("after"), after)
    sp.set(q("line"), line)
    sp.set(q("lineRule"), "auto")

    if indent_left is not None or fill:
        ind = ET.SubElement(ppr, q("ind"))
        if fill:
            ind.set(q("left"), indent_left or "80")
            ind.set(q("right"), "80")
            ind.set(q("firstLine"), "0")
        else:
            ind.set(q("left"), indent_left)
            ind.set(q("firstLine"), "0")

    jc = ET.SubElement(ppr, q("jc"))
    jc.set(q("val"), "left")

    rpr = upsert_child(ppr, "rPr")
    # reset rPr
    for child in list(rpr):
        rpr.remove(child)
    fonts = ET.SubElement(rpr, q("rFonts"))
    for k in ("ascii", "hAnsi", "eastAsia", "cs"):
        fonts.set(q(k), "Microsoft Yahei")
    if bold:
        ET.SubElement(rpr, q("b")).set(q("val"), "1")
        ET.SubElement(rpr, q("bCs")).set(q("val"), "1")
    ET.SubElement(rpr, q("color")).set(q("val"), INK)
    ET.SubElement(rpr, q("sz")).set(q("val"), size)
    ET.SubElement(rpr, q("szCs")).set(q("val"), size)
    return ppr


def replace_text_runs(p: ET.Element, new_runs: list[ET.Element]) -> None:
    """Keep pPr; replace all non-pPr children with new runs. Drawings must not be here."""
    for child in list(p):
        if local(child) != "pPr":
            p.remove(child)
    for r in new_runs:
        p.append(r)


def is_empty(p: ET.Element) -> bool:
    if has_drawing(p):
        return False
    return not para_text(p).strip()


def classify(text: str) -> str:
    raw = text
    t = text.strip()
    if not t:
        return "empty"
    if t == "王婧雯":
        return "name"
    if "ankknaiii@outlook.com" in t:
        return "contact"
    if t in SECTIONS or t.rstrip() in SECTIONS:
        return "section"
    if DATE_RE.match(raw.rstrip()) or DATE_RE.match(t):
        return "dated"
    if t.startswith("•") or t.startswith("·"):
        return "bullet"
    # short bold-only headings (company / workstream / project)
    if len(t) <= 80 and "。" not in t and "；" not in t:
        return "subhead"
    return "body"


def restyle_document(xml_path: Path) -> None:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    body = root.find(q("body"))
    assert body is not None

    # page background (SSENSE cream)
    bg = root.find(q("background"))
    if bg is None:
        bg = ET.Element(q("background"))
        root.insert(0, bg)
    bg.set(q("color"), PAGE)

    paras = [el for el in list(body) if local(el) == "p"]

    for p in paras:
        text = para_text(p)
        kind = classify(text)

        if has_drawing(p) and not text.strip():
            style_ppr(p, size="28", bold=True, before="40", after="0", line="240")
            ns_wp = "{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}"
            for posh in p.iter(f"{ns_wp}positionH"):
                off = posh.find(f"{ns_wp}posOffset")
                if off is not None:
                    off.text = "6024245"
            continue

        if kind == "empty":
            # collapse PDF spacer paragraphs
            style_ppr(p, before="0", after="0", line="40")
            continue

        if kind == "name":
            style_ppr(p, size="32", bold=True, before="40", after="40", line="276")
            replace_text_runs(p, [make_run("王婧雯", size="32", bold=True)])
            continue

        if kind == "contact":
            style_ppr(p, size="16", before="0", after="160", line="240")
            restyle_contact_keep_links(p)
            continue

        if kind == "section":
            label = text.strip()
            style_ppr(
                p,
                size="18",
                bold=True,
                before="220",
                after="60",
                line="240",
                fill=SAND_DEEP,
                border_bottom=True,
                keep_next=True,
            )
            replace_text_runs(p, [make_run(label, size="18", bold=True)])
            continue

        if kind == "dated":
            m = DATE_RE.match(text.rstrip()) or DATE_RE.match(text.strip())
            assert m
            title = m.group("title").rstrip()
            date = m.group("date").strip()
            style_ppr(
                p,
                size="18",
                bold=True,
                before="140",
                after="40",
                line="240",
                fill=SAND,
                right_tab=True,
                keep_next=True,
            )
            replace_text_runs(
                p,
                [
                    make_run(title, size="18", bold=True),
                    make_tab_run(size="18", bold=False, color=MUTED),
                    make_run(date, size="17", bold=False, color=MUTED),
                ],
            )
            continue

        if kind == "subhead":
            label = text.strip()
            style_ppr(
                p,
                size="17",
                bold=True,
                before="100",
                after="40",
                line="240",
                fill=SAND,
                keep_next=True,
            )
            replace_text_runs(p, [make_run(label, size="17", bold=True)])
            continue

        if kind == "bullet":
            style_ppr(p, size="17", before="20", after="60", line="276", indent_left="200")
            restyle_inline_keep_marks(p, size="17")
            continue

        # body
        style_ppr(p, size="17", before="20", after="60", line="276")
        restyle_inline_keep_marks(p, size="17")

    sect = body.find(q("sectPr"))
    if sect is not None:
        pgMar = sect.find(q("pgMar"))
        if pgMar is not None:
            for side in ("top", "bottom", "left", "right"):
                pgMar.set(q(side), str(MARGIN if side in ("left", "right") else "480"))

    tree.write(xml_path, encoding="UTF-8", xml_declaration=True)

    settings_path = xml_path.parent / "settings.xml"
    raw = settings_path.read_text(encoding="utf-8")
    if "displayBackgroundShape" not in raw:
        raw = raw.replace(
            "<w:embedTrueTypeFonts",
            "<w:displayBackgroundShape w:val=\"1\"/><w:embedTrueTypeFonts",
            1,
        )
        settings_path.write_text(raw, encoding="utf-8")


def restyle_contact_keep_links(p: ET.Element) -> None:
    """Keep hyperlink elements; restyle run colors to ink, not Google-blue."""
    for rpr in p.iter(q("rPr")):
        color = rpr.find(q("color"))
        if color is not None:
            color.set(q("val"), LINK)
        for sz in rpr.findall(q("sz")) + rpr.findall(q("szCs")):
            sz.set(q("val"), "16")
        fonts = rpr.find(q("rFonts"))
        if fonts is None:
            fonts = ET.SubElement(rpr, q("rFonts"))
        for k in ("ascii", "hAnsi", "eastAsia", "cs"):
            fonts.set(q(k), "Microsoft Yahei")
        u = rpr.find(q("u"))
        if u is not None and u.get(q("val")) == "none":
            rpr.remove(u)
    for link in p.findall(q("hyperlink")):
        for rpr in link.iter(q("rPr")):
            u = rpr.find(q("u"))
            if u is None:
                u = ET.SubElement(rpr, q("u"))
            u.set(q("val"), "single")
            color = rpr.find(q("color"))
            if color is not None:
                color.set(q("val"), LINK)


def restyle_inline_keep_marks(p: ET.Element, size: str) -> None:
    """Keep original wording/bold/italic/hyperlinks; only normalize size, font, ink color."""
    for el in p.iter():
        if local(el) != "rPr":
            continue
        for sz in el.findall(q("sz")) + el.findall(q("szCs")):
            sz.set(q("val"), size)
        color = el.find(q("color"))
        u = el.find(q("u"))
        is_link = u is not None and u.get(q("val")) == "single"
        if color is None:
            color = ET.SubElement(el, q("color"))
        color.set(q("val"), LINK if is_link else INK)
        fonts = el.find(q("rFonts"))
        if fonts is None:
            fonts = ET.SubElement(el, q("rFonts"))
        for k in ("ascii", "hAnsi", "eastAsia", "cs"):
            fonts.set(q(k), "Microsoft Yahei")


def main() -> None:
    src = Path("/workspace/resume/source.docx")
    work = Path("/tmp/resume_fmt")
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)
    with zipfile.ZipFile(src) as z:
        z.extractall(work)
    restyle_document(work / "word" / "document.xml")

    out = Path("/workspace/resume/王婧雯-简历包.docx")
    if out.exists():
        out.unlink()
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for path in work.rglob("*"):
            if path.is_file():
                z.write(path, path.relative_to(work).as_posix())
    print("wrote", out, out.stat().st_size)


if __name__ == "__main__":
    main()
