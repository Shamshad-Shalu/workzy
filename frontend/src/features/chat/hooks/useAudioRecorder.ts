import { useCallback, useEffect, useRef, useState } from 'react';

import { normalizeMimeType } from '../constants/chatUpload';

function formatDuration(seconds: number) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export interface AudioRecorderResult {
  recording: boolean;
  recordSeconds: number;
  startRecording: () => Promise<void>;
  cancelRecording: () => void;
  stopAndGetFile: () => Promise<{ file: File; duration: string } | null>;
}

export function useAudioRecorder(): AudioRecorderResult {
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordSecondsRef = useRef(0);

  useEffect(() => {
    if (!recording) {
      return;
    }
    setRecordSeconds(0);
    recordSecondsRef.current = 0;
    const id = setInterval(() => {
      setRecordSeconds(s => {
        recordSecondsRef.current = s + 1;
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [recording]);

  useEffect(() => {
    return () => {
      // stop microphone
      mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      mediaRecorderRef.current = null;
    };
  }, []);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

    const recorder = new MediaRecorder(stream, { mimeType });
    audioChunksRef.current = [];
    recorder.ondataavailable = ev => {
      if (ev.data.size > 0) {
        audioChunksRef.current.push(ev.data);
      }
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }, []);

  const cancelRecording = useCallback(() => {
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    mediaRecorderRef.current = null;
    setRecording(false);
  }, []);

  const stopAndGetFile = useCallback((): Promise<{ file: File; duration: string } | null> => {
    return new Promise(resolve => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setRecording(false);
        resolve(null);
        return;
      }

      const duration = formatDuration(recordSecondsRef.current);

      recorder.onstop = () => {
        recorder.stream.getTracks().forEach(t => t.stop());
        const mime = normalizeMimeType(recorder.mimeType) || 'audio/webm';
        const ext = mime.includes('ogg') ? 'ogg' : 'webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: mime });
        mediaRecorderRef.current = null;
        setRecording(false);
        resolve({ file, duration });
      };
      recorder.stop();
    });
  }, []);

  return { recording, recordSeconds, startRecording, cancelRecording, stopAndGetFile };
}

export { formatDuration };
