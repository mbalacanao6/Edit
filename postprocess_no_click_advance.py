"""Post-process the generated deck:
1. Disable 'advance on mouse click' on every slide so only the game buttons navigate.
2. Drop run-level hyperlinks that pptxgenjs copies onto button text. The whole shape is
   already clickable (link on p:cNvPr); run-level links would recolor the label to the
   theme hyperlink color and underline it."""
import re, sys, zipfile, shutil, os
src = sys.argv[1]
tmp = src + ".tmp"
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if re.fullmatch(r"ppt/slides/slide\d+\.xml", item.filename):
            x = data.decode("utf-8")
            if "<p:transition" not in x:
                tag = '<p:transition advClick="0"/>'
                if "</p:clrMapOvr>" in x:
                    x = x.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + tag, 1)
                else:
                    x = x.replace("</p:cSld>", "</p:cSld>" + tag, 1)
            def strip(m):
                inner = re.sub(r"<a:hlinkClick\b[^>]*/>", "", m.group(2))
                inner = re.sub(r"<a:hlinkClick\b[^>]*>.*?</a:hlinkClick>", "", inner, flags=re.S)
                return m.group(1) + inner + m.group(3)
            x = re.sub(r"(<a:rPr\b[^>]*[^/]>)(.*?)(</a:rPr>)", strip, x, flags=re.S)
            data = x.encode("utf-8")
        zout.writestr(item, data)
shutil.move(tmp, src)
print("advClick=0 applied")
