//Angel David Veron Cuevas
import java.util.HashMap; // import the HashMap class
import java.util.Scanner;

public class actividad1 {

  public static void main(String[] args) {
    HashMap<Character, Integer> letras_repetidas = new HashMap<Character, Integer>();
    Scanner scann = new Scanner(System.in);
    String cadena = scann.nextLine();
    Integer contador = 0;
    for (int i = 0; i < cadena.length(); i++) {
      if (cadena.charAt(i) != ' ') {
        for (Character key : letras_repetidas.keySet()) {
          if (key == cadena.charAt(i)) {
            contador = letras_repetidas.get(cadena.charAt(i));
            contador += 1;
            letras_repetidas.replace(cadena.charAt(i), contador);
          }
        }
        
        if (contador == 0) {
          letras_repetidas.put(cadena.charAt(i), 1);
        }
        contador = 0;
      }
    }
     System.out.println(letras_repetidas);
  }
}
