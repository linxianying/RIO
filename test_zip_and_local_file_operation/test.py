# the security of this piece of codes is terrible,
# if there are already img files existing in the temp folder,
# there will be many unpredictable potential error
# besides, it seems that os.path.join will automatically create folder
# when the specified folder does not exist, i need to further check whether this is true

import os # for local file operation
import zipfile # for zip file operation

current_path = os.getcwd()
print current_path

list = os.listdir(os.path.join(os.getcwd(), 'media'))
print list

f = zipfile.ZipFile(os.path.join(os.getcwd(), 'media/case_closed.zip'), "r")
print f.namelist()
num = f.namelist().__len__()

if os.path.isdir(os.getcwd()):
    print "yeah"
    img_folder_path = os.path.join(os.getcwd(), 'media', 'temp_img') # get path and also create folder
    print img_folder_path
    # os.mkdir(img_folder_path)

i = 0
for file in f.namelist():
    f.extract(file, img_folder_path)
    os.rename(os.path.join(img_folder_path, f.namelist()[i]),
                os.path.join(img_folder_path, str(i) + '.jpeg')
              )
    i = i + 1



