import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityDetailsModalProps } from './Types';
import { useTranslation } from 'react-i18next';


const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  onClose,
}) => {
  const {t}=useTranslation();
  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.heading}>{t("Activity details")}</Text>
        <Text>{t("Name")}: {activity.nameActivity}</Text>
        <Text>{t("Date")}: {activity.dateActivity.toLocaleDateString()}</Text>
        <Text>{t("Description")}: {activity.descriptionActivity}</Text>
        <Text>{t("Creator")}: {activity.creatorActivity}</Text>
        <Text>
          {t("Participants")}: {activity.participantsActivity?.join(', ')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>{t("Close")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ActivityDetailsModal;
