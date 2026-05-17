import zipfile
import re
import os

doc_path = 'E:/portfolio-main/public/assets/Smart_HR_Portal_Documentation_v2.docx'
out_dir = 'E:/portfolio-main/public/assets/smart-hr'
os.makedirs(out_dir, exist_ok=True)

with zipfile.ZipFile(doc_path, 'r') as z:
    rels_xml = z.read('word/_rels/document.xml.rels').decode('utf-8')
    doc_xml = z.read('word/document.xml').decode('utf-8')
    
    rel_map = {}
    for match in re.finditer(r'<Relationship Id="(rId\d+)"[^>]+Target="([^"]+)"', rels_xml):
        rId = match.group(1)
        target = match.group(2)
        rel_map[rId] = target
        
    image_rIds = re.findall(r'<a:blip r:embed="(rId\d+)"', doc_xml)
    
    for idx, rId in enumerate(image_rIds):
        if rId in rel_map:
            target = rel_map[rId]
            img_path = 'word/' + target
            if img_path in z.namelist():
                ext = os.path.splitext(target)[1]
                new_name = f'tab_{idx+1}{ext}'
                with open(os.path.join(out_dir, new_name), 'wb') as f:
                    f.write(z.read(img_path))
                print(f'Extracted {new_name}')
