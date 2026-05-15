import { Howl } from 'howler';

const STORAGE_KEYS = {
  trackUrl: 'canopy-audio-track',
  pausedPosition: 'canopy-audio-position',
  enabled: 'canopy-audio-enabled',
};

const DEFAULT_TRACK_URL = 'https://res.cloudinary.com/da4y5zf5k/video/upload/Forest-Waltz_sam8s8.wav';

let currentTrackUrl = DEFAULT_TRACK_URL;
let currentHowl: Howl | null = null;
let initialized = false;
let audioEnabled = false;
let playbackId: number | null = null;
let pausedPosition = 0;

function loadSavedState() {
  if (typeof window === 'undefined') {
    return {
      trackUrl: DEFAULT_TRACK_URL,
      pausedPosition: 0,
      enabled: false,
    };
  }

  try {
    const trackUrl = localStorage.getItem(STORAGE_KEYS.trackUrl) || DEFAULT_TRACK_URL;
    const pausedValue = Number(localStorage.getItem(STORAGE_KEYS.pausedPosition) ?? '0');
    const enabledValue = localStorage.getItem(STORAGE_KEYS.enabled) === 'true';

    return {
      trackUrl,
      pausedPosition: Number.isNaN(pausedValue) ? 0 : pausedValue,
      enabled: enabledValue,
    };
  } catch {
    return {
      trackUrl: DEFAULT_TRACK_URL,
      pausedPosition: 0,
      enabled: false,
    };
  }
}

function saveState() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.trackUrl, currentTrackUrl);
    localStorage.setItem(STORAGE_KEYS.pausedPosition, String(pausedPosition));
    localStorage.setItem(STORAGE_KEYS.enabled, String(audioEnabled));
  } catch {
    // ignore storage errors
  }
}

function createHowl(url: string) {
  return new Howl({
    src: [url],
    loop: true,
    volume: 0.75,
    html5: true,
  });
}

function initAudio() {
  if (initialized) return;
  currentHowl = createHowl(currentTrackUrl);
  currentHowl.load();
  initialized = true;
}

function resumeTrack() {
  initAudio();

  if (!audioEnabled || !currentHowl) return;

  if (playbackId === null) {
    playbackId = currentHowl.play();
  } else if (!currentHowl.playing(playbackId)) {
    currentHowl.play(playbackId);
  }

  if (pausedPosition > 0 && playbackId !== null) {
    currentHowl.seek(pausedPosition, playbackId);
  }
}

function pauseTrack() {
  if (!currentHowl || playbackId === null) return;

  if (currentHowl.playing(playbackId)) {
    pausedPosition = currentHowl.seek(playbackId) as number;
    currentHowl.pause(playbackId);
    saveState();
  }
}

function teardownTrack() {
  if (currentHowl) {
    currentHowl.stop();
    currentHowl.unload();
  }
  currentHowl = null;
  playbackId = null;
}

export const audioManager = {
  init(enabled = false) {
    const saved = loadSavedState();
    currentTrackUrl = saved.trackUrl || DEFAULT_TRACK_URL;
    pausedPosition = saved.pausedPosition || 0;
    audioEnabled = enabled;

    initAudio();
    if (audioEnabled) {
      resumeTrack();
    }
  },

  selectTrack(url: string) {
    if (url === currentTrackUrl && currentHowl) {
      return;
    }

    currentTrackUrl = url;
    pausedPosition = 0;
    teardownTrack();
    currentHowl = createHowl(url);
    currentHowl.load();
    saveState();
  },

  playAudio() {
    audioEnabled = true;
    resumeTrack();
    saveState();
  },

  pauseAudio() {
    audioEnabled = false;
    pauseTrack();
    saveState();
  },

  setAudioEnabled(enabled: boolean) {
    audioEnabled = enabled;

    if (enabled) {
      resumeTrack();
    } else {
      pauseTrack();
    }

    saveState();
  },

  isAudioEnabled() {
    return audioEnabled;
  },

  getCurrentTrackUrl() {
    return currentTrackUrl;
  },
};
