import zipfile
import tempfile
import shutil
import os

def remove_borders(input_docx, output_docx):
    # docx files are just zip archives of XML files.
    # Page borders are typically found in word/document.xml within the <w:sectPr> element as <w:pgBorders>
    temp_dir = tempfile.mkdtemp()
    
    with zipfile.ZipFile(input_docx, 'r') as zip_ref:
        zip_ref.extractall(temp_dir)
        
    doc_path = os.path.join(temp_dir, 'word', 'document.xml')
    
    with open(doc_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove page borders: <w:pgBorders ...> ... </w:pgBorders>
    import re
    # This regex will remove the entire pgBorders tag and its contents
    # using non-greedy match.
    new_content = re.sub(r'<w:pgBorders.*?</w:pgBorders>', '', content, flags=re.DOTALL)
    
    # Also check if there's self closing <w:pgBorders/> just in case (though unlikely)
    new_content = re.sub(r'<w:pgBorders[^>]*/>', '', new_content)

    if content != new_content:
        print("Page borders found and removed in document.xml.")
    else:
        print("No <w:pgBorders> found in document.xml.")
        
    # Let's also check section properties in word/styles.xml just in case
    styles_path = os.path.join(temp_dir, 'word', 'styles.xml')
    if os.path.exists(styles_path):
        with open(styles_path, 'r', encoding='utf-8') as f:
            styles_content = f.read()
        
        # Remove borders from styling if it's there
        # For paragraphs <w:pBdr> and tables <w:tblBorders>
        # We probably shouldn't blindly remove table borders if they just said "the border" (usually page border)
        # but let's see. 

    with open(doc_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    # Re-zip the document
    with zipfile.ZipFile(output_docx, 'w', zipfile.ZIP_DEFLATED) as zip_out:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_dir)
                zip_out.write(file_path, arcname)
                
    # Clean up temp dir
    shutil.rmtree(temp_dir)
    print(f"Saved borderless document to {output_docx}")

if __name__ == '__main__':
    remove_borders('Final_Combined_Documentation.docx', 'Final_Combined_Documentation_NoBorders.docx')
