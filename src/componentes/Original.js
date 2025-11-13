import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export default function Original() {
  const [heroes, setHeroes] = useState([]);
  const [currentHero, setCurrentHero] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);
  const [userWin, setUserWin] = useState(0);
  const [userLose, setUserLose] = useState(0);
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // Autenticación
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
    });
    return unsub;
  }, []);

  // Datos usuario Firebase
  useEffect(() => {
    if (!uid) return;
    const traerDatos = async () => {
      const ref = doc(db, "usuarios", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setUserWin(data.ganados || 0);
        setUserLose(data.perdidos || 0);
      } else {
        await setDoc(ref, { ganados: 0, perdidos: 0 });
      }
    };
    traerDatos();
  }, [uid]);

  // Cargar héroes de API
  const cargarHeroes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json"
      );
      const data = await res.json();
      setHeroes(data);
      generarPregunta(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHeroes();
  }, []);

  // Progreso animado
  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: (question / 10) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateProgress();
  }, [question]);

  const generarPregunta = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const hero = data[randomIndex];
    const opciones = [hero.name];

    while (opciones.length < 4) {
      const fake = data[Math.floor(Math.random() * data.length)].name;
      if (!opciones.includes(fake)) opciones.push(fake);
    }

    opciones.sort(() => Math.random() - 0.5);
    setCurrentHero(hero);
    setOptions(opciones);
    setSelected(null);
    setResult("");
  };

  const guardarResultado = async (acierto) => {
    if (!uid) return;
    const fecha = new Date().toISOString();
    try {
      await setDoc(doc(db, "resultados", `${uid}_${fecha}`), {
        uid,
        heroe: currentHero.name,
        aciertos: acierto ? 1 : 0,
        errores: acierto ? 0 : 1,
        fecha,
      });
      const ref = doc(db, "usuarios", uid);
      await updateDoc(ref, {
        ganados: acierto ? userWin + 1 : userWin,
        perdidos: !acierto ? userLose + 1 : userLose,
      });
    } catch (e) {
      console.error("Error al guardar resultado:", e);
    }
  };

  const handleSelect = async (opcion) => {
    if (selected) return;
    setSelected(opcion);
    const acierto = opcion === currentHero.name;
    setResult(acierto ? "✅ ¡Correcto!" : `❌ Era: ${currentHero.name}`);
    await guardarResultado(acierto);

    if (acierto) {
      setScore(score + 1);
      setUserWin(userWin + 1);
    } else {
      setUserLose(userLose + 1);
    }
  };

  const siguientePregunta = () => {
    if (question < 10) {
      setQuestion(question + 1);
      generarPregunta(heroes);
    } else {
      setFinished(true);
    }
  };

  const reiniciarJuego = () => {
    setQuestion(1);
    setScore(0);
    setFinished(false);
    generarPregunta(heroes);
  };

  if (loading || !currentHero)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Cargando superhéroes...
        </Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧠 Trivia de Superhéroes 🦸‍♂️</Text>

      <Text style={styles.stats}>
        Pregunta {question}/10 • Puntos:{" "}
        <Text style={styles.green}>{score}</Text>
      </Text>

      {/* Barra de progreso */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { width: `${progressAnim._value}%` }]}
        />
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: currentHero.images.md }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {!finished ? (
        <>
          <View style={styles.optionsContainer}>
            {options.map((op, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.option,
                  selected === op &&
                    (op === currentHero.name
                      ? styles.correct
                      : styles.incorrect),
                ]}
                onPress={() => handleSelect(op)}
              >
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {result !== "" && (
            <Text style={styles.result}>{result}</Text>
          )}

          {selected && (
            <TouchableOpacity
              style={styles.button}
              onPress={siguientePregunta}
            >
              <Text style={styles.buttonText}>
                {question === 10 ? "Ver puntaje final" : "Siguiente ➜"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.scoreContainer}>
          <Text style={styles.finalText}>🎯 Puntaje final: {score}/10</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={reiniciarJuego}
          >
            <Text style={styles.buttonText}>Reiniciar trivia 🔁</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0d1117",
    padding: 20,
    alignItems: "center",
    minHeight: "100%",
  },
  loading: {
    flex: 1,
    backgroundColor: "#0d1117",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00bcd4",
    marginVertical: 10,
    textAlign: "center",
  },
  stats: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  green: { color: "#4caf50", fontWeight: "bold" },
  red: { color: "#f44336", fontWeight: "bold" },
  card: {
    backgroundColor: "#161b22",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#00bcd4",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#00bcd4",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  correct: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  incorrect: {
    backgroundColor: "#f44336",
    borderColor: "#f44336",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  result: {
    color: "#fff",
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#00bcd4",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  progressBar: {
    height: 10,
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00bcd4",
    borderRadius: 10,
  },
  scoreContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  finalText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
