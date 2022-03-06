// Para ejectuar g++ -o actividad1 actividad1.cpp
#include <iostream>
#include <string>
using namespace std;
int count(string s, char c)
{
    int res = 0;
    for (int i=0;i<s.length();i++)
        if (s[i] == c)
            res++;
    return res;
}
int main()
{
	cout << "El texto introducido es:" << "\n";
	string cadena;
   	cin >> cadena; 
	string letras_repetidas = " ";
    for (int i=0;i<cadena.length();i++)
		if (letras_repetidas.find(cadena[i]) == string::npos){
        cout << "La letra: " << cadena[i] << " se repite " <<count(cadena, cadena[i]) << endl;
		letras_repetidas += cadena[i];;
		}  
    return 0;
}