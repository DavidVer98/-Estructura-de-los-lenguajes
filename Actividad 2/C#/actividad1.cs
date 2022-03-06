// para ejecutar mcs -out:actividad1.exe actividad1.cs 
// Angel David Veron Cuevas
using System;
using System.Collections.Generic;

namespace Project_1 {
    class MainClass {
        public static void Main (string[] args) {
            Console.WriteLine("Ingresa una cadena:");
            String cadena;
            cadena=Console.ReadLine();
            Console.WriteLine("El texto introducido es: " + cadena);
            bool espacio;
            Dictionary<string, int> letrasRepetidas = new Dictionary<string, int>();  
            int value;
            bool hasValue;
            for (int i = 0; i < cadena.Length; i++){
                hasValue = letrasRepetidas.TryGetValue(cadena.Substring(i, 1), out value);
                espacio = (Char.IsWhiteSpace(cadena, i));
                if (hasValue)
                    letrasRepetidas[cadena.Substring(i, 1)] = letrasRepetidas[cadena.Substring(i, 1)] +  1;
                else if (!espacio)
                    letrasRepetidas.Add(cadena.Substring(i, 1), 1);  
            }
            foreach (KeyValuePair<string, int> letra in letrasRepetidas)
            {
                Console.WriteLine("La letra :"+ letra.Key + " se repite  " + letra.Value );
            }
        }
    }
}