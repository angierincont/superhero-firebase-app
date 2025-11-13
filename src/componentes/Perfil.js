import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Perfil() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [ganados, setGanados] = useState(0);
  const [perdidos, setPerdidos] = useState(0);
  const [cargando, setCargando] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      try {
        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || "");
          setTelefono(data.telefono || "");
          setCorreo(data.correo || "");
          setGanados(data.ganados || 0);
          setPerdidos(data.perdidos || 0);
        } else {
          Alert.alert("Usuario no encontrado");
        }
      } catch (error) {
        Alert.alert("Error al cargar datos", error.message);
      }
      setCargando(false);
    };
    traerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    try {
      const docRef = doc(db, "usuarios", uid);
      await updateDoc(docRef, { nombre, telefono });
      Alert.alert("✅ Datos actualizados correctamente");
    } catch (error) {
      Alert.alert("❌ Error al actualizar", error.message);
    }
  };

  if (cargando)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
      </View>
    );

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=1920&q=80",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Text style={styles.title}>👤 Perfil del Usuario</Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.emailText}>{correo}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#aaa"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{ganados}</Text>
              <Text style={styles.statLabel}>Ganados</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{perdidos}</Text>
              <Text style={styles.statLabel}>Perdidos</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={actualizarDatos}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0d1117",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#161b22",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#00bcd4",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#1e90ff33",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00bcd4",
    marginBottom: 20,
    textShadowColor: "#00bcd4",
    textShadowRadius: 10,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  emailText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 10,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#00bcd433",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00bcd4",
  },
  statLabel: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
