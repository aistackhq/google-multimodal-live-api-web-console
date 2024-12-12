/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useRef, useState } from "react";
import { Settings, AlertTriangle, CheckCircle2 } from "lucide-react";

import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import SidePanel from "./components/side-panel/SidePanel";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import { SettingsModal } from "./components/settings/Settings";
import { useLocalStorage } from "./hooks/use-local-storage";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_APIK_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  // this video reference is used for displaying the active stream, whether that is the webcam or screen capture
  // feel free to style as you see fit
  const videoRef = useRef<HTMLVideoElement>(null);
  // either the screen capture, the video or null, if null we hide it
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  const [apiKey, setApiKey] = useLocalStorage<string | null>('apiKey', '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApiKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  useEffect(() => {
    if (!apiKey) {
      setIsModalOpen(true);
    }
  }, [apiKey]);

  return (
    <div className="App">
      <div style={{
        padding: '1rem',
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        right: 0
      }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '0.5rem',
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1000,
              borderRadius: '9999px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
          <Settings style={{ width: '1.5rem', height: '1.5rem', color: '#4b5563' }} />
          {apiKey ? (
            <CheckCircle2 style={{
              width: '1rem',
              height: '1rem',
              color: '#22c55e',
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.25rem'
            }} />
          ) : (
              <AlertTriangle style={{
                width: '1rem',
                height: '1rem',
                color: '#eab308',
                position: 'absolute',
                top: '-0.25rem',
                right: '-0.25rem'
              }} />
            )}
          </button>
        </div>
      {apiKey ? <LiveAPIProvider url={uri} apiKey={apiKey}>
       
        <div className="streaming-console">
          <SidePanel />
          <main>
            <div className="main-app-area">
              {/* APP goes here */}
              <Altair />
              <video
                className={cn("stream", {
                  hidden: !videoRef.current || !videoStream,
                })}
                ref={videoRef}
                autoPlay
                playsInline
              />
            </div>

            <ControlTray
              videoRef={videoRef}
              supportsVideo={true}
              onVideoStreamChange={setVideoStream}
            >
              {/* put your own buttons here */}
            </ControlTray>
          </main>
        </div>
      </LiveAPIProvider>:<div style={{
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100vh',
        color: 'white',
        flexDirection: 'column',
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold'
          }}>No API Key</h1>
        <p>Please enter an API Key to use this app.</p>
      </div>}
      <SettingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleApiKeySubmit}
        />
    </div>
  );
}

export default App;
