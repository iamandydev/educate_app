# Educate

React Native educational app for students. Students log in with a school code and identification number, browse lessons by course, and complete level-based quizzes with a timer. Supports offline answer queuing with automatic sync when connectivity is restored.

## Tech Stack

- **React Native 0.86.0** (New Architecture enabled)
- **React 19.2.3**
- **TypeScript**
- **react-native-web** for browser support
- **react-native-fs** for native file-based storage
- **@react-native-community/netinfo** for connectivity detection
- **State-based navigation** (no react-navigation)

## Project Structure

```
Educate/
├── App.tsx                          # Root component, screen routing via state
├── src/
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript interfaces
│   ├── constants/
│   │   ├── colors.ts                # App color palette
│   │   └── profileColors.ts         # Profile bubble colors + getRandomColor()
│   ├── components/
│   │   ├── Boton.tsx                # Reusable button (solid/outline variants)
│   │   └── ScreenHeader.tsx         # Header with back arrow + optional right element
│   ├── screens/
│   │   ├── LoadingScreen.tsx        # Splash screen (2s timeout)
│   │   ├── LoginScreen.tsx          # 2-step login: code → identification number
│   │   ├── PerfilScreen.tsx         # Profile carousel, three-dot menu, logout
│   │   ├── HomeScreen.tsx           # Lesson grid (FlatList numColumns=2)
│   │   ├── NivelesScreen.tsx        # Levels list (inverted sort, bottom-to-top)
│   │   ├── QuizScreen.tsx           # Question + options + timer + submit
│   │   └── AjustesScreen.tsx        # App settings / info
│   ├── services/
│   │   ├── api.ts                   # REST API client (all endpoints)
│   │   ├── connectivity.ts          # NetInfo-based connectivity (native)
│   │   ├── connectivity.web.ts      # navigator.onLine-based connectivity (web)
│   │   └── syncQueue.ts            # Offline answer queue + sync on reconnect
│   └── storage/
│       ├── storageService.ts        # Native file storage (react-native-fs)
│       └── storageService.web.ts    # Web localStorage storage
├── android/                         # Android native project
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml      # INTERNET + network state permissions
│   │   └── java/com/educate/        # Native Android code
│   └── gradle.properties            # usesCleartextTraffic, newArchEnabled
└── package.json
```

## API Endpoints

Base URL: `http://192.168.20.79/educate_api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/alumno/login` | Student login (body: `{codigo, numero_identificacion}`) |
| GET | `/alumnos/{codigo}` | Get student data + enrolled courses |
| GET | `/cursos/{id}/lecciones` | List lessons for a course |
| GET | `/lecciones/{id}/niveles` | List levels for a lesson |
| GET | `/lecciones/{id}/niveles/{id}` | Get level detail + question |
| POST | `/niveles/{id}/responder` | Submit answer (body: `{codigo_alumno, respuesta, tiempo_segundos}`) |
| GET | `/alumnos/{codigo}/progreso` | Student progress (available, not yet integrated) |

## Key Features

### Multi-Profile Support
- Multiple student profiles stored in `profiles.json`
- Per-profile caching of lessons and levels
- Duplicate code prevention on login
- Profile deletion via three-dot menu (data removed locally)

### Offline Sync
- Answers queued in `pending_answers.json` when offline
- Automatic sync when connectivity is restored
- Listens for network state changes in real-time

### Quiz System
- Multiple-choice questions (A/B/C/D)
- Timer tracks response time from screen load
- Online: answer validated via API, result shown immediately
- Offline: answer saved locally, synced later

### Storage Architecture
- **Native**: File-based (`react-native-fs`) in `DocumentDirectoryPath/user_data/`
- **Web**: `localStorage` with keys prefixed by `user_data/`
- Platform-specific implementations via `.ts` / `.web.ts` extensions

## Building

### Android APK

```bash
cd android
./gradlew.bat assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Web

```bash
npm run web
```

## Configuration

The API base URL is set in `src/services/api.ts`. Change `API_BASE_URL` to match your server.

`android/gradle.properties` contains:
- `usesCleartextTraffic=true` (required for HTTP API calls)
- `newArchEnabled=true` (React Native New Architecture)
