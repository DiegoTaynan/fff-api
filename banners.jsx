import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Text,
} from "react-native";
import { styles } from "./banners.style";

function Banners(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(0);

  const openModal = (index) => {
    setSelectedBannerIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const nextBanner = () => {
    setSelectedBannerIndex((prevIndex) => (prevIndex + 1) % props.dados.length);
  };

  const prevBanner = () => {
    setSelectedBannerIndex(
      (prevIndex) => (prevIndex - 1 + props.dados.length) % props.dados.length
    );
  };

  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {props.dados.map((banner, index) => (
          <View key={banner.id_banner} style={styles.banners}>
            <TouchableOpacity onPress={() => openModal(index)}>
              <Image style={styles.icone} source={{ uri: banner.imagePath }} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {modalVisible && (
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.navButtonLeft} onPress={prevBanner}>
              <Text style={styles.navButtonText}>{"<"}</Text>
            </TouchableOpacity>
            <Image
              style={styles.modalImage}
              source={{ uri: props.dados[selectedBannerIndex].imagePath }}
            />
            <TouchableOpacity
              style={styles.navButtonRight}
              onPress={nextBanner}
            >
              <Text style={styles.navButtonText}>{">"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default Banners;
