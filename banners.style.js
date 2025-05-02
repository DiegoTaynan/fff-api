import { COLORS, FONT_SIZE } from "../../constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  icone: {
    width: 220,
    height: 120,
    marginTop: 20,
    marginRight: 20,
    borderRadius: 6,
  },
  banners: {
    paddingRight: 10,
    marginTop: 20,
    marginBottom: 15,
  },
  descricao: {
    fontSize: FONT_SIZE.xsm,
    color: COLORS.gray2,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute", // Torna o botão posicionado de forma absoluta
    bottom: 20, // Ajusta a distância do botão em relação à parte inferior
    alignSelf: "center", // Centraliza horizontalmente
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  navButtonLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 10,
    zIndex: 10, // Garante que o botão fique acima de outros elementos
  },
  navButtonRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 10,
    zIndex: 10, // Garante que o botão fique acima de outros elementos
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});
