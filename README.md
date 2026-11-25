# PMWA Contacts

Simple call list: name + mobile + Call button.
Rebuild: `python build.py "PMWA Contacts.xlsx" extra.json` → inject into tpl.html as index.html; then PDF: `cd ../aiagent && NODE_PATH=node_modules node ../contacts/pdf.js`.
extra.json = phones/new contacts from later PDF lists that are not yet in the xlsx.
