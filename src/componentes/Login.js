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
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
    } catch (error) {
      Alert.alert("Error al iniciar sesión", "Verifica tus credenciales e intenta de nuevo.");
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
        <View style={styles.card}>
          <Text style={styles.title}>🔐 Iniciar Sesión</Text>

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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Registro")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerTextHighlight}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
  registerLink: {
    marginTop: 18,
  },
  registerText: {
    color: "#aaa",
    fontSize: 14,
  },
  registerTextHighlight: {
    color: "#00bcd4",
    fontWeight: "bold",
  },
});
