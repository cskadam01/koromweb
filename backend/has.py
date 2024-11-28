import bcrypt

# Példa jelszó
password = "123"

# Jelszó hash-elése bcrypt-tel
hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

print("Hash-elt jelszó:", hashed_password)
