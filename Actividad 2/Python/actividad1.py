cadena = input("Ingresa cadena: ") 
letras_repetidas = dict()  
for letra in cadena: 
    if letra != ' ':
        if letra in letras_repetidas: 
            letras_repetidas[letra] += 1 
        else:
            letras_repetidas[letra] = 1 
print(letras_repetidas)