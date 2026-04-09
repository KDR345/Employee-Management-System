import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        # The namespace for WordProcessingML
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        paragraphs = []
        for p in tree.findall('.//w:p', ns):
            texts = [t.text for t in p.findall('.//w:t', ns) if t.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    path = sys.argv[1]
    text = extract_text(path)
    print(f"Extracted length: {len(text)}")
    print("--- START OF CONTENT ---")
    print(text[:10000])  # Print first 10000 chars to avoid overwhelming output
    print("--- END OF CONTENT ---")
