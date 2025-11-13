import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from "react-native";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch("https://raw.githubusercontent.com/akabab/superhero-api/master/api/all.json");
        const json = await res.json();
        setData(json.slice(0, 20)); // solo 20 héroes
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerDatos();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Cargando héroes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌟 Galería de Superhéroes</Text>
      <View style={styles.grid}>
        {data.map((hero) => (
          <View key={hero.id} style={styles.card}>
            <Image source={{ uri: hero.images.md }} style={styles.image} />
            <Text style={styles.name}>{hero.name}</Text>
            <Text style={styles.realName}>
              {hero.biography.fullName || "Nombre real desconocido"}
            </Text>
            <View style={styles.powerContainer}>
              <Text style={styles.powerTitle}>Poder: </Text>
              <Text style={styles.powerValue}>
                {hero.powerstats.power || "??"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0d1117",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0d1117",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  title: {
    color: "#00bcd4",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    textShadowColor: "#00bcd4",
    textShadowRadius: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#161b22",
    width: "45%",
    marginBottom: 20,
    borderRadius: 16,
    alignItems: "center",
    padding: 12,
    shadowColor: "#00bcd4",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#1e90ff33",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 8,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  realName: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 6,
  },
  powerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e2f",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  powerTitle: {
    color: "#00bcd4",
    fontSize: 12,
    fontWeight: "bold",
  },
  powerValue: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
});
