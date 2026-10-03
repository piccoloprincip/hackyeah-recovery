import React, { useEffect, useRef, useState } from 'react';
import { AppState, Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';

const HAND = require('./assets/hand-reference.png');
const APARAT = require('./assets/aparat-reference.jpeg');
const C = { ink: '#172C30', muted: '#687C80', teal: '#008783', pale: '#E8F5F3', surface: '#F2F6F6', line: '#E4ECEC', bone: '#B74D54', muscle: '#B76648', tendon: '#926B20' };
const font = Platform.select({ ios: 'Avenir Next', android: 'sans-serif', web: 'Avenir Next, Avenir, system-ui, sans-serif' });
const areas = [
  { id: 'bone', name: 'Kość', color: C.bone, point: [.745, .665] },
  { id: 'muscle', name: 'Mięśnie', color: C.muscle, point: [.665, .75] },
  { id: 'tendon', name: 'Ścięgna', color: C.tendon, point: [.825, .475] },
];
const exercises = [
  { title: 'Łagodny ruch palców', copy: 'Spokojny rytm zginania i prostowania.', tag: 'Ruchomość palców', icon: 'hand', support: 50 },
  { title: 'Kciuk do opuszków', copy: 'Małe ruchy. Coraz lepsza koordynacja.', tag: 'Precyzja ruchu', icon: 'target', support: 40 },
  { title: 'Pewniejszy chwyt', copy: 'Poczuj rytm chwytania i rozluźniania.', tag: 'Siła chwytu', icon: 'activity', support: 30 },
];
const tabs = [['scan', 'RTG', 'scan'], ['exercises', 'Ćwiczenia', 'activity'], ['progress', 'Postępy', 'chart']];

function Icon({ name, size = 22, color = C.teal }) {
  const shapes = {
    scan: 'M8 3H4v4M16 3h4v4M4 17v4h4M20 17v4h-4M7 12h10', upload: 'M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5', arrow: 'M5 12h14m-6-6 6 6-6 6', back: 'M19 12H5m6-6-6 6 6 6',
    check: 'm5 12 4 4L19 6', lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5zM12 14v3', activity: 'M2 12h5l3-8 4 16 3-8h5', chart: 'M4 4v16h17M7 14l4-4 4 2 5-7',
    hand: 'M7 12V6a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v7-3a2 2 0 0 1 4 0v6c0 5-4 7-8 7-3 0-5-2-6-4l-3-5a2 2 0 0 1 3-2l2 2',
    device: 'M8 3h8l2 5v8l-2 5H8l-2-5V8zM9 8h6v8H9z', bluetooth: 'M12 2v20l6-5L6 7m0 10L18 7l-6-5', target: 'M12 3a9 9 0 1 0 .01 0M12 8a4 4 0 1 0 .01 0',
    play: 'm8 5 11 7-11 7z', pause: 'M8 5v14M16 5v14', stop: 'M6 6h12v12H6z', plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', trash: 'M4 6h16M9 6V3h6v3M6 6l1 16h10l1-16M10 10v8M14 10v8',
  };
  return <Svg width={size} height={size} viewBox="0 0 26 26" fill="none" accessibilityElementsHidden><Path d={shapes[name] || shapes.scan} stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" /></Svg>;
}
function Button({ children, onPress, disabled, secondary, icon = 'arrow', style }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed, focused }) => [s.button, secondary && s.secondary, disabled && { opacity: .4 }, pressed && { opacity: .75 }, focused && s.focus, style]}><Text style={[s.buttonText, secondary && { color: C.teal }]}>{children}</Text><Icon name={icon} size={21} color={secondary ? C.teal : 'white'} /></Pressable>;
}
function Pill({ children, neutral }) { return <View style={[s.pill, neutral && { backgroundColor: C.surface }]}><Text style={[s.pillText, neutral && { color: C.muted }]}>{children}</Text></View>; }
function Bar({ value, color = C.teal, label }) { return <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }} style={s.track}><View style={[s.fill, { width: `${Math.max(0, Math.min(value, 100))}%`, backgroundColor: color }]} /></View>; }
function Steps({ current }) {
  return <View style={s.steps}>{['Twoje RTG', 'Podgląd', 'Twój plan'].map((label, i) => <View key={label} style={s.step}><View style={[s.stepTrack, i <= current && { backgroundColor: C.teal }]} /><View style={s.stepLabelRow}><View style={[s.stepDot, i <= current && { backgroundColor: C.teal }]}>{i < current ? <Icon name="check" size={11} color="white" /> : <Text style={[s.stepNumber, i <= current && { color: 'white' }]}>{i + 1}</Text>}</View><Text style={[s.stepLabel, i === current && { color: C.ink, fontWeight: '600' }]}>{label}</Text></View></View>)}</View>;
}
function AparatVisual() {
  const { width: screenWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageAttempt, setImageAttempt] = useState(0);
  const width = measuredWidth || Math.max(1, Math.min(screenWidth, 480) - 40);
  // Show only the product photo in the supplied reference, without its interface.
  const photoWidth = width * 1.09;
  return <View onLayout={e => { if (e.nativeEvent.layout.width > 0) setMeasuredWidth(e.nativeEvent.layout.width); }} style={[s.aparatVisual, { aspectRatio: undefined, height: width / 3.7, flexShrink: 0 }]}>
    <Image key={imageAttempt} source={APARAT} onLoad={() => setImageError(false)} onError={() => setImageError(true)} accessibilityLabel="Wizualizacja koncepcji: lekki Aparat na dłoń" style={{ position: 'absolute', width: photoWidth, height: photoWidth * 1984 / 2138, top: -photoWidth * .25, left: -width * .045 }} resizeMode="stretch" />
    {imageError && <Pressable accessibilityRole="button" onPress={() => { setImageError(false); setImageAttempt(attempt => attempt + 1); }} style={[StyleSheet.absoluteFillObject, { backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', padding: 12 }]}><Text style={s.small}>Nie udało się wczytać podglądu dłoni.</Text><Text style={s.link}>Wczytaj ponownie</Text></Pressable>}
  </View>;
}
function Anatomy({ selected, onSelect }) {
  const [width, setWidth] = useState(0);
  const area = areas.find(item => item.id === selected);
  const imageWidth = Math.min(width, 310 * 562 / 723);
  const imageHeight = imageWidth * 723 / 562;
  const x = (width - imageWidth) / 2;
  const y = 26 + (310 - imageHeight) / 2;
  return <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={s.anatomy}>
    <View style={s.anatomyTop}><Text style={s.figureLabel}>PRAWA DŁOŃ</Text><Text style={s.figureLabel}>Widok demonstracyjny</Text></View>
    <Image source={HAND} resizeMode="contain" style={{ position: 'absolute', top: 26, height: 310, width: '100%' }} accessibilityLabel="Przykładowy model dłoni z kością zaznaczoną na czerwono, mięśniami na koralowo i ścięgnami na złoto" />
    {width > 0 && areas.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Pokaż: ${item.name.toLowerCase()}`} accessibilityState={{ selected: selected === item.id }} hitSlop={9} onPress={() => onSelect(item.id)} style={[s.marker, { left: x + imageWidth * item.point[0] - 12, top: y + imageHeight * item.point[1] - 12, borderColor: item.color, backgroundColor: selected === item.id ? item.color : 'white' }]}><View style={[s.markerDot, { backgroundColor: selected === item.id ? 'white' : item.color }]} /></Pressable>)}
    <View style={s.anatomyCaption}><View style={[s.smallDot, { backgroundColor: area.color }]} /><Text style={[s.captionText, { color: area.color }]}>{area.name}</Text><Text style={s.captionHint}>Dotknij punktu</Text></View>
  </View>;
}

export default function App() {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState('scan');
  const [asset, setAsset] = useState(null);
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('bone');
  const [exercise, setExercise] = useState(null);
  const [remaining, setRemaining] = useState(20);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [support, setSupport] = useState(50);
  const [metric, setMetric] = useState('grip');
  const [measured, setMeasured] = useState(false);
  const scroll = useRef(null);
  const deadline = useRef(0);
  const activeTimer = useRef(null);
  const completionRecorded = useRef(false);
  const pickerVersion = useRef(0);
  useEffect(() => { if (Platform.OS === 'web') { document.title = 'ręcovery'; document.documentElement.lang = 'pl'; } }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setRunning(false); setDone(true);
        if (!completionRecorded.current) { completionRecorded.current = true; setSessions(count => count + 1); }
      }
    }, 150);
    activeTimer.current = timer;
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', state => { if (state !== 'active') setRunning(false); });
    return () => listener.remove();
  }, []);
  function go(next) { setRunning(false); setTab(next); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function resetSession() { clearInterval(activeTimer.current); activeTimer.current = null; setRunning(false); setRemaining(20); setDone(false); completionRecorded.current = false; }
  function openExercise(index) { resetSession(); setExercise(index); setSupport(exercises[index].support); scroll.current?.scrollTo({ y: 0, animated: false }); }
  function startOver() {
    pickerVersion.current += 1;
    deadline.current = 0;
    resetSession();
    setAsset(null); setReviewed(false); setBusy(false); setError('');
    setSelected('bone'); setExercise(null); setSessions(0); setSupport(50);
    setMetric('grip'); setMeasured(false);
    go('scan');
  }
  async function chooseImage() {
    if (busy) return;
    const requestVersion = ++pickerVersion.current;
    setBusy(true); setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: false, quality: 1 });
      if (requestVersion !== pickerVersion.current) return;
      if (!result.canceled && result.assets?.[0]) {
        const next = result.assets[0];
        if (next.fileSize > 20 * 1024 * 1024) { setError('Wybierz zdjęcie mniejsze niż 20 MB.'); return; }
        setAsset(next); setReviewed(false); setSelected('bone'); setExercise(null); setSessions(0); setMeasured(false); resetSession();
      }
    } catch { if (requestVersion === pickerVersion.current) setError('Nie udało się otworzyć zdjęć. Spróbuj ponownie.'); }
    finally { if (requestVersion === pickerVersion.current) setBusy(false); }
  }
  const unlocked = Boolean(asset && reviewed);
  const currentExercise = exercise === null ? null : exercises[exercise];
  const grip = measured ? 10.2 : 9.6;

  function uploadScreen() {
    return <><Steps current={0} />
      <Pressable accessibilityRole="button" accessibilityLabel={asset ? 'Zmień zdjęcie RTG' : 'Wybierz zdjęcie RTG'} disabled={busy} onPress={chooseImage} style={({ pressed, focused }) => [s.upload, asset && { borderStyle: 'solid' }, pressed && { opacity: .75 }, focused && s.focus]}>
        {asset ? <><Image source={{ uri: asset.uri }} style={s.xrayPreview} resizeMode="contain" /><View style={s.uploadedLabel}><Icon name="check" size={17} /><Text style={s.uploadedText}>Zdjęcie RTG dodane</Text><Text style={s.replace}>Zmień</Text></View></> : <><View style={s.uploadIcon}><Icon name="upload" size={29} /></View>{busy && <Text style={s.uploadTitle}>Otwieranie zdjęć…</Text>}<Text style={s.small}>Dotknij, aby wybrać zdjęcie</Text><Text style={s.fileHint}>JPG, PNG lub HEIC · do 20 MB</Text></>}
      </Pressable>
      <Button secondary icon="trash" onPress={startOver} style={{ marginBottom: 14, borderWidth: 1, borderColor: '#99C8C3' }}>Usuń zdjęcie i zacznij od nowa</Button>
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      <Button disabled={!asset || busy} onPress={() => { setReviewed(true); scroll.current?.scrollTo({ y: 0, animated: false }); }}>Zobacz moją dłoń</Button>
    </>;
  }
  function handScreen() {
    return <><Steps current={1} />
      <Button secondary icon="trash" onPress={startOver} style={{ marginBottom: 20, borderWidth: 1, borderColor: '#99C8C3' }}>Usuń zdjęcie i zacznij od nowa</Button>
      <Anatomy selected={selected} onSelect={setSelected} />
      <Button style={{ marginTop: 20 }} onPress={() => { setExercise(null); go('exercises'); }}>Zobacz mój plan ćwiczeń</Button>
    </>;
  }
  function exerciseList() {
    return <><Steps current={2} /><View style={s.sectionIntro}><Text style={s.heroSmall}>Z każdym ruchem bliżej.</Text><Text style={s.body}>Małe kroki do tego, co kochasz.</Text></View><View style={s.planBanner}><Icon name="activity" /><View style={{ flex: 1 }}><Text style={s.bannerTitle}>Twój plan demonstracyjny</Text><Text style={s.small}>3 ćwiczenia · w Twoim tempie</Text></View><Pill>Demo</Pill></View>
      {exercises.map((item, index) => <Pressable key={item.title} accessibilityRole="button" accessibilityLabel={`Otwórz ćwiczenie: ${item.title}`} onPress={() => openExercise(index)} style={({ pressed, focused }) => [s.exerciseCard, pressed && { backgroundColor: C.pale }, focused && s.focus]}><View style={s.exerciseTop}><View style={s.exerciseIcon}><Icon name={item.icon} size={24} /></View><Text style={s.exerciseNumber}>0{index + 1}</Text></View><View style={s.exerciseTitleRow}><Text style={[s.cardTitle, { flex: 1 }]}>{item.title}</Text><View style={s.playButton}><Icon name="play" size={19} color="white" /></View></View><Text style={s.body}>{item.copy}</Text><View style={s.exerciseBottom}><Pill>{item.tag}</Pill><Text style={s.small}>20 s · podgląd</Text></View></Pressable>)}
      <Text style={s.footnote}>Przykładowy plan. Silniki są nieaktywne. Ćwiczenia i zakresy ruchu ustala specjalista.</Text>
    </>;
  }
  function sessionScreen() {
    const reps = Math.min(4, Math.floor((20 - remaining) / 5));
    return <><Pressable accessibilityRole="button" onPress={() => { resetSession(); setExercise(null); }} style={s.back}><Icon name="back" size={19} /><Text style={s.link}>Wszystkie ćwiczenia</Text></Pressable><View style={s.sectionIntro}><Text style={s.heroSmall}>{currentExercise.title}</Text><Text style={s.body}>{currentExercise.copy}</Text></View><AparatVisual /><View style={s.visualCaption}><View style={[s.smallDot, { backgroundColor: running ? C.teal : C.muted }]} /><Text style={s.small}>{done ? 'Gotowe. Mały sukces.' : running ? 'Trwa symulacja ruchu' : 'Zacznij, gdy będziesz gotów'}</Text><Pill neutral>Symulacja</Pill></View>
      <View style={s.stats}><View style={s.stat}><Text style={s.small}>Siła · demo</Text><Text style={s.statValue}>{running ? (1.8 + reps * .2).toFixed(1).replace('.', ',') : '0,0'}<Text style={s.unit}> kg</Text></Text></View><View style={s.stat}><Text style={s.small}>Powtórzenia</Text><Text style={s.statValue}>{reps}<Text style={s.unit}> / 4</Text></Text></View></View>
      <View style={s.card}><View style={s.rowBetween}><Text style={s.cardTitle}>{done ? 'Sesja zakończona' : 'Postęp sesji'}</Text><Text style={s.tealValue}>{remaining} s</Text></View><Bar value={(20 - remaining) * 5} label="Postęp sesji" /><Text style={s.small}>{done ? 'Sesja demonstracyjna zapisana.' : running ? 'Możesz wstrzymać lub zakończyć w każdej chwili.' : remaining < 20 ? 'Pauza. Nie spiesz się.' : '20 sekund podglądu wspomaganego ruchu.'}</Text></View>
      <View style={s.card}><View style={s.rowBetween}><Text style={s.cardTitle}>Wsparcie ruchu</Text><Text style={s.tealValue}>{support}%</Text></View><Bar value={support} label="Podgląd wspomagania ruchu" /><View style={s.rowBetween}><Pressable accessibilityRole="button" accessibilityLabel="Mniejsze wspomaganie" disabled={running || support === 0} onPress={() => setSupport(v => Math.max(0, v - 10))} style={[s.adjust, (running || support === 0) && { opacity: .35 }]}><Icon name="minus" size={19} /><Text style={s.link}>Mniej</Text></Pressable><Text style={s.small}>Wspomaganie · demo</Text><Pressable accessibilityRole="button" accessibilityLabel="Większe wspomaganie" disabled={running || support === 100} onPress={() => setSupport(v => Math.min(100, v + 10))} style={[s.adjust, (running || support === 100) && { opacity: .35 }]}><Text style={s.link}>Więcej</Text><Icon name="plus" size={19} /></Pressable></View></View>
      <Text style={s.footnote}>Tryb demonstracyjny. Urządzenie nie jest sterowane.</Text>
    </>;
  }
  function progressScreen() {
    const values = metric === 'grip' ? [6.2, 7, 7.4, 8.9, grip] : [35, 39, 44, 49, 55];
    const target = metric === 'grip' ? 12 : 65;
    return <><View style={s.sectionIntro}><Text style={s.heroSmall}>Małe postępy. Wielka motywacja.</Text><Text style={s.body}>Każda poprawa zasługuje na uwagę.</Text></View>
      <View style={s.card}><View style={s.rowBetween}><Text style={[s.cardTitle, { flex: 1 }]}>Powrót do sprawności</Text><Text style={s.tealValue}>{Math.round(grip / 38 * 100)}%</Text></View><Bar value={grip / 38 * 100} label="Chwyt względem przykładowego poziomu odniesienia" /><View style={s.inline}><Icon name="chart" size={17} /><Text style={[s.small, { flex: 1 }]}>+{(grip - 6.2).toFixed(1).replace('.', ',')} kg od pierwszego przykładowego pomiaru</Text></View><Text style={s.finePrint}>Przykładowy poziom odniesienia: 38 kg</Text></View>
      <View style={s.stats}>{[['Chwyt', String(grip).replace('.', ','), 'kg'], ['Zakres', '55', '°'], ['Sesje', String(sessions), '']].map(([label, value, unit]) => <View key={label} style={s.stat}><Text style={s.small}>{label}</Text><Text style={s.statValue}>{value}<Text style={s.unit}>{unit === 'kg' ? ' kg' : unit}</Text></Text></View>)}</View>
      <View style={s.card}><View style={s.segmented}>{[['grip', 'Siła chwytu'], ['range', 'Ruch palców']].map(([id, label]) => <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: metric === id }} onPress={() => setMetric(id)} style={[s.segment, metric === id && s.segmentActive]}><Text style={[s.segmentText, metric === id && { color: C.teal }]}>{label}</Text></Pressable>)}</View><View style={s.chart}>{values.map((value, i) => <View key={i} style={s.barColumn}><Text style={s.barValue}>{String(value).replace('.', ',')}{metric === 'range' ? '°' : ''}</Text><View style={[s.chartBar, { height: value / target * 125, backgroundColor: i === 4 ? C.teal : '#ADDBD6' }]} /><Text style={s.day}>{['Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.'][i]}</Text></View>)}</View></View>
      <View style={s.card}><View style={s.rowBetween}><Text style={s.cardTitle}>Coraz większy zakres</Text><Pill>+6°</Pill></View><Text style={s.body}>Zakres ruchu palców</Text><Bar value={55 / 90 * 100} color="#249977" label="Przykładowy zakres ruchu palców" /><Text style={s.small}>55° z przykładowego celu 90°</Text></View>
      <Button icon="activity" disabled={measured} onPress={() => setMeasured(true)}>{measured ? 'Pomiar demo dodany' : 'Wypróbuj pomiar chwytu'}</Button><Text style={s.footnote}>Dane przykładowe, nie pomiary Twojej dłoni. Licznik sesji obejmuje ukończone tutaj demonstracje.</Text>
    </>;
  }
  const title = tab === 'exercises' ? (currentExercise ? 'Twoja sesja' : 'Ćwiczenia') : null;
  return <SafeAreaView style={s.safe} accessibilityLanguage="pl-PL"><StatusBar barStyle="dark-content" backgroundColor="white" /><View style={[s.phone, width > 540 && s.phoneOnDesktop]}>
    <View style={s.header}><View style={{ flex: 1, paddingRight: 8 }}><Text style={s.brand}>ręcovery<Text style={{ color: '#90C6BE' }}>.</Text></Text>{title && <Text style={s.headerTitle}>{title}</Text>}</View><View style={{ alignItems: 'flex-end', gap: 4 }}><View style={s.connection}><Icon name="bluetooth" size={15} color={C.muted} /><Text style={s.connectionText}>Aparat niepołączony</Text></View>{(asset || busy) && <Pressable accessibilityRole="button" accessibilityLabel="Usuń zdjęcie i zacznij od nowa" onPress={startOver} style={({ pressed, focused }) => [{ minHeight: 40, justifyContent: 'center', paddingHorizontal: 5 }, pressed && { opacity: .6 }, focused && s.focus]}><Text style={[s.link, { fontSize: 11 }]}>Zacznij od nowa</Text></Pressable>}</View></View>
    <ScrollView ref={scroll} showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={s.content}>{tab === 'scan' ? (unlocked ? handScreen() : uploadScreen()) : unlocked ? (tab === 'exercises' ? (currentExercise ? sessionScreen() : exerciseList()) : progressScreen()) : uploadScreen()}</ScrollView>
    {tab === 'exercises' && currentExercise && unlocked && <View style={[s.actionRow, { paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderColor: C.line }]}><Button style={{ flex: 1 }} icon={done ? 'check' : running ? 'pause' : 'play'} onPress={() => { if (done) { go('progress'); return; } if (!running) deadline.current = Date.now() + remaining * 1000; setRunning(!running); }}>{done ? 'Zobacz postępy' : running ? 'Pauza' : remaining < 20 ? 'Wznów' : 'Rozpocznij'}</Button>{!done && <Button secondary icon="stop" onPress={resetSession}>Zakończ</Button>}</View>}
    <View accessibilityRole="tablist" style={s.navigation}>{tabs.map(([id, label, icon]) => <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: tab === id, disabled: id !== 'scan' && !unlocked }} disabled={id !== 'scan' && !unlocked} onPress={() => go(id)} style={({ pressed, focused }) => [s.navItem, pressed && { backgroundColor: C.pale }, focused && s.focus]}><View style={[s.navIcon, tab === id && { backgroundColor: C.pale }]}><Icon name={icon} size={23} color={tab === id ? C.teal : !unlocked ? '#B4C2C3' : C.muted} /></View><Text style={[s.navText, tab === id && { color: C.teal, fontWeight: '700' }, !unlocked && id !== 'scan' && { color: '#8D9DA0' }]}>{label}</Text></Pressable>)}</View>
  </View></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#E8EEEE' : 'white', alignItems: 'center' }, phone: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: 'white', overflow: 'hidden' }, phoneOnDesktop: { marginVertical: 22, borderRadius: 30, borderWidth: 1, borderColor: '#D2DFDE', boxShadow: '0px 18px 70px rgba(24,54,54,0.10)' },
  header: { paddingHorizontal: 22, paddingTop: 15, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { fontFamily: font, fontSize: 23, fontWeight: '700', letterSpacing: -.9, color: C.teal }, headerTitle: { fontFamily: font, fontSize: 21, color: C.ink, fontWeight: '600', letterSpacing: -.7, marginTop: 3 }, connection: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 30, backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, paddingHorizontal: 9, paddingVertical: 7 }, connectionText: { fontFamily: font, fontSize: 10, color: C.muted }, content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 28 },
  steps: { flexDirection: 'row', gap: 10, marginBottom: 29 }, step: { flex: 1 }, stepTrack: { height: 3, borderRadius: 3, backgroundColor: C.line, marginBottom: 9 }, stepLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 }, stepDot: { width: 17, height: 17, borderRadius: 9, backgroundColor: C.surface, justifyContent: 'center', alignItems: 'center' }, stepNumber: { fontFamily: font, fontSize: 9, color: C.muted }, stepLabel: { fontFamily: font, fontSize: 10, color: C.muted },
  heroSmall: { fontFamily: font, color: C.ink, fontSize: 25, lineHeight: 31, fontWeight: '600', letterSpacing: -.8, marginBottom: 6 }, sectionIntro: { marginBottom: 20 }, body: { fontFamily: font, color: C.muted, fontSize: 13, lineHeight: 21 }, small: { fontFamily: font, color: C.muted, fontSize: 11, lineHeight: 17 }, finePrint: { fontFamily: font, color: C.muted, fontSize: 10, lineHeight: 16 },
  upload: { minHeight: 208, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#99C8C3', borderRadius: 22, backgroundColor: '#F0F8F6', justifyContent: 'center', alignItems: 'center', padding: 20, marginBottom: 18, overflow: 'hidden' }, uploadIcon: { height: 58, width: 58, backgroundColor: 'white', borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }, uploadTitle: { fontFamily: font, color: C.ink, fontSize: 17, fontWeight: '600', marginBottom: 5 }, fileHint: { fontFamily: font, color: C.muted, fontSize: 10, marginTop: 17 }, xrayPreview: { height: 174, width: '100%', borderRadius: 10, backgroundColor: '#172325' }, uploadedLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'stretch', paddingTop: 12 }, uploadedText: { fontFamily: font, color: C.teal, fontSize: 12, fontWeight: '600' }, replace: { fontFamily: font, color: C.muted, fontSize: 11, marginLeft: 'auto' },
  button: { minHeight: 52, borderRadius: 15, paddingHorizontal: 17, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.teal }, secondary: { backgroundColor: C.pale }, buttonText: { fontFamily: font, fontSize: 14, fontWeight: '600', color: 'white', flexShrink: 1 }, focus: Platform.OS === 'web' ? { outlineWidth: 2, outlineStyle: 'solid', outlineColor: '#4CB7AD', outlineOffset: 2 } : {}, error: { fontFamily: font, color: C.bone, fontSize: 12, marginBottom: 12 }, footnote: { fontFamily: font, color: C.muted, fontSize: 10, lineHeight: 16, marginTop: 15, textAlign: 'center' }, link: { fontFamily: font, color: C.teal, fontSize: 12, fontWeight: '600' },
  navigation: { flexDirection: 'row', borderTopWidth: 1, borderColor: C.line, paddingTop: 7, paddingBottom: Platform.OS === 'web' ? 12 : 7, backgroundColor: 'white' }, navItem: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 12 }, navIcon: { width: 47, height: 30, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }, navText: { fontFamily: font, color: C.muted, fontSize: 10 }, pill: { backgroundColor: C.pale, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5, alignSelf: 'flex-start' }, pillText: { fontFamily: font, color: C.teal, fontSize: 10, fontWeight: '500' },
  anatomy: { height: 369, borderRadius: 22, overflow: 'hidden', backgroundColor: '#C1D0D7' }, anatomyTop: { position: 'absolute', top: 13, left: 15, right: 15, flexDirection: 'row', justifyContent: 'space-between', zIndex: 2 }, figureLabel: { fontFamily: font, fontSize: 9, color: '#405B63', letterSpacing: .5 }, marker: { position: 'absolute', width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, markerDot: { width: 6, height: 6, borderRadius: 3 }, smallDot: { width: 6, height: 6, borderRadius: 3 }, anatomyCaption: { position: 'absolute', bottom: 11, left: 13, right: 13, backgroundColor: '#FFFFFFDE', borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 7, padding: 10 }, captionText: { fontFamily: font, fontSize: 10, fontWeight: '600' }, captionHint: { fontFamily: font, fontSize: 9, color: C.muted, marginLeft: 'auto' }, 
  cardTitle: { fontFamily: font, color: C.ink, fontSize: 15, lineHeight: 21, fontWeight: '600', letterSpacing: -.2 }, planBanner: { padding: 15, backgroundColor: C.pale, borderRadius: 15, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }, bannerTitle: { fontFamily: font, color: C.ink, fontSize: 12, fontWeight: '600', marginBottom: 3 }, exerciseCard: { padding: 18, borderWidth: 1, borderColor: C.line, borderRadius: 21, marginBottom: 14, backgroundColor: 'white' }, exerciseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, exerciseIcon: { backgroundColor: C.surface, width: 40, height: 40, borderRadius: 13, justifyContent: 'center', alignItems: 'center' }, exerciseNumber: { fontFamily: font, fontSize: 12, color: '#91A5A7' }, exerciseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 5 }, playButton: { width: 34, height: 34, borderRadius: 11, backgroundColor: C.teal, alignItems: 'center', justifyContent: 'center' }, exerciseBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15, gap: 6 }, aparatVisual: { width: '100%', aspectRatio: 2.1, borderRadius: 20, overflow: 'hidden', backgroundColor: C.surface }, visualCaption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, marginTop: 10, marginBottom: 20 }, back: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 38, marginBottom: 13 },
  stats: { flexDirection: 'row', gap: 9, marginBottom: 17 }, stat: { flex: 1, backgroundColor: C.surface, borderRadius: 17, paddingHorizontal: 11, paddingVertical: 17, gap: 6 }, statValue: { fontFamily: font, color: C.ink, fontSize: 25, fontWeight: '600', letterSpacing: -.7, fontVariant: ['tabular-nums'] }, unit: { fontSize: 13, fontWeight: '500', letterSpacing: -.2 }, card: { borderWidth: 1, borderColor: C.line, borderRadius: 21, padding: 17, marginBottom: 17, gap: 12 }, rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }, tealValue: { fontFamily: font, color: C.teal, fontSize: 18, fontWeight: '600', fontVariant: ['tabular-nums'] }, track: { height: 9, borderRadius: 9, backgroundColor: '#EDF3F2', overflow: 'hidden' }, fill: { height: '100%', borderRadius: 9 }, inline: { flexDirection: 'row', gap: 6, alignItems: 'center' }, adjust: { minHeight: 44, minWidth: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }, actionRow: { flexDirection: 'row', gap: 9 }, segmented: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: 12, padding: 3 }, segment: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 10 }, segmentActive: { backgroundColor: 'white' }, segmentText: { fontFamily: font, fontSize: 10, color: C.muted, fontWeight: '600' }, chart: { height: 178, flexDirection: 'row', alignItems: 'flex-end', gap: 9, marginTop: 4 }, barColumn: { flex: 1, alignItems: 'center', gap: 7 }, chartBar: { width: '100%', borderTopLeftRadius: 9, borderTopRightRadius: 9 }, barValue: { fontFamily: font, fontSize: 10, color: C.muted }, day: { fontFamily: font, fontSize: 10, color: C.muted }, 
});
