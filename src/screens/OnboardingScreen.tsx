
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  onComplete: () => void;
};

type Page = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  options?: string[];
};

const pages: Page[] = [
  {
    image: require('../../nebou_inicio/nebousaludando.png'),
    title: '¡BIENVENIDO A PUNTUA!',
    description:
      '¡Hola! Soy Nebou y te acompañaré en tu camino hacia la universidad.',
  },
  {
    image: require('../../nebou_inicio/neboupensativo.png'),
    title: '¿CUÁL ES TU OBJETIVO?',
    description: 'Queremos conocer tus metas para acompañarte mejor.',
    options: [
      'Ingresar a la universidad',
      'Reforzar mis conocimientos',
      'Explorar y aprender',
    ],
  },
  {
    image: require('../../nebou_inicio/nebousorprendido.png'),
    title: '¿CÓMO CONOCISTE PUNTUA?',
    description: 'Cuéntanos cómo llegaste hasta aquí.',
    options: [
      'Redes sociales',
      'Amigos o familiares',
      'Mi institución educativa',
      'Otro medio',
    ],
  },
  {
    image: require('../../nebou_inicio/nebouaprendiendo.png'),
    title: 'APRENDE A TU RITMO',
    description:
      'Practica en cinco áreas académicas. Descubre tus fortalezas y refuerza lo que necesitas mejorar.',
  },
  {
    image: require('../../nebou_inicio/neboulike.png'),
    title: '¡TU PROGRESO CUENTA!',
    description:
      'Consigue puntos, supera misiones, aumenta tus rangos y mantén tu racha de estudio.',
  },
  {
    image: require('../../nebou_inicio/nebouesperando.png'),
    title: 'TU PRIMER PASO PARA LA UNIVERSIDAD, ¿LISTO?',
    description:
      'Cada gran meta comienza con un primer paso. ¡Comencemos!',
  },
];

export default function OnboardingScreen({ onComplete }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  const page = pages[pageIndex];
  const last = pageIndex === pages.length - 1;
  const needsChoice = Boolean(page.options?.length);
  const canProceed = !needsChoice || Boolean(answers[pageIndex]);

  async function next() {
    if (!canProceed || saving) return;

    if (!last) {
      setPageIndex((index) => index + 1);
      return;
    }

    setSaving(true);

    try {
      await AsyncStorage.setItem(
        'puntua_onboarding_answers',
        JSON.stringify({
          objective: answers[1],
          discovery: answers[2],
        }),
      );

      onComplete();
    } catch (error) {
      console.error('No se pudieron guardar las respuestas:', error);
      Alert.alert(
        'No se pudo continuar',
        'Inténtalo nuevamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>PUNTUA</Text>
          <Text style={styles.counter}>
            {pageIndex + 1} / {pages.length}
          </Text>
        </View>

        <View style={styles.progress}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                i <= pageIndex && styles.segmentActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.hero}>
          <View style={styles.mascotContainer}>
            <Image
              source={page.image}
              style={styles.mascot}
              resizeMode="contain"
              accessibilityLabel="Nebou, mascota de PUNTUA"
            />
          </View>

          <Text style={styles.title}>{page.title}</Text>

          <Text style={styles.description}>
            {page.description}
          </Text>
        </View>

        <View style={styles.options}>
          {page.options?.map((option) => {
            const selected = answers[pageIndex] === option;

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() =>
                  setAnswers((old) => ({
                    ...old,
                    [pageIndex]: option,
                  }))
                }
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
              >
                <Text style={styles.optionLabel}>
                  {option}
                </Text>

                <Text style={styles.radio}>
                  {selected ? '●' : '○'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          {pageIndex > 0 && (
            <TouchableOpacity
              onPress={() =>
                setPageIndex((index) => index - 1)
              }
              disabled={saving}
              style={styles.back}
              accessibilityRole="button"
            >
              <Text style={styles.backLabel}>Atrás</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={next}
            disabled={!canProceed || saving}
            accessibilityRole="button"
            style={[
              styles.next,
              (!canProceed || saving) && styles.disabled,
            ]}
          >
            <Text style={styles.nextLabel}>
              {saving
                ? 'GUARDANDO...'
                : last
                  ? '¡ESTOY LISTO!'
                  : 'CONTINUAR'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#10152B',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#C4B5FD',
  },

  counter: {
    fontSize: 14,
    color: '#B9B2D7',
  },

  progress: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },

  segment: {
    flex: 1,
    height: 6,
    borderRadius: 8,
    backgroundColor: '#37314E',
  },

  segmentActive: {
    backgroundColor: '#A78BFA',
  },

  hero: {
    flexGrow: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  mascotContainer: {
    width: '100%',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  mascot: {
    width: '100%',
    height: '100%',
    maxWidth: 280,
    alignSelf: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 35,
    marginBottom: 14,
  },

  description: {
    color: '#C3BFD7',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },

  options: {
    gap: 11,
    marginBottom: 22,
  },

  option: {
    padding: 17,
    backgroundColor: '#23283F',
    borderWidth: 1,
    borderColor: '#46425D',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionSelected: {
    backgroundColor: '#4D3D85',
    borderColor: '#B7A2FF',
  },

  optionLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
  },

  radio: {
    color: '#C4B5FD',
    fontSize: 20,
    marginLeft: 10,
  },

  footer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
  },

  back: {
    borderWidth: 1,
    borderColor: '#625A88',
    borderRadius: 12,
    paddingHorizontal: 23,
    paddingVertical: 17,
    justifyContent: 'center',
  },

  backLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  next: {
    flex: 1,
    backgroundColor: '#8061D8',
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextLabel: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  disabled: {
    opacity: 0.45,
  },
});