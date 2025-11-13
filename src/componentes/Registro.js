import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigation = useNavigation();

  const handleRegistro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre,
        correo,
        telefono,
        ganados: 0,
        perdidos: 0,
      });

      Alert.alert("✅ Éxito", "Usuario registrado correctamente");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("❌ Error al registrarse", "Verifica los datos e intenta de nuevo.");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1601758123927-1969c09aa545?auto=format&fit=crop&w=1920&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>📝 Registro</Text>

            <TextInput
              placeholder="Nombre completo"
              placeholderTextColor="#aaa"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />

            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              value={correo}
              onChangeText={setCorreo}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              value={contrasena}
              onChangeText={setContrasena}
              style={styles.input}
              secureTextEntry
            />

            <TextInput
              placeholder="Teléfono"
              placeholderTextColor="#aaa"
              value={telefono}
              onChangeText={setTelefono}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegistro}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.loginTextHighlight}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#0d1117",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(13, 17, 23, 0.85)",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#161b22",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#00bcd4",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#1e90ff33",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00bcd4",
    marginBottom: 25,
    textShadowColor: "#00bcd4",
    textShadowRadius: 10,
  },
  input: {
    backgroundColor: "#1e1e2f",
    borderRadius: 10,
    width: "100%",
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#00bcd466",
    color: "#fff",
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    marginTop: 18,
  },
  loginText: {
    color: "#aaa",
    fontSize: 14,
  },
  loginTextHighlight: {
    color: "#00bcd4",
    fontWeight: "bold",
  },
});
