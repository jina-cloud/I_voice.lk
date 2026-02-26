🎙️ I_voice.lkThe next-generation Voice AI interface for Sri Lanka and beyond.
I_voice.lk is a high-performance, real-time voice assistant framework designed to bridge the gap between human speech and digital intelligence. 
Leveraging cutting-edge LLMs and low-latency audio processing, it provides a seamless conversational experience.
✨ Key Features⚡ Ultra-Low Latency: Real-time speech-to-text (STT) and text-to-speech (TTS) pipelines.
🧠 Context-Aware: Powered by advanced Large Language Models for intelligent, natural conversations.
🌍 Localized: Built with support for regional nuances and multilingual capabilities.
🛠️ Extensible: Easily integrate custom tools, APIs, and hardware (like ESP32/IoT devices).
📱 Cross-Platform: Ready for web, mobile, and telephony integration.
🚀 Getting StartedPrerequisitesPython 3.9+Jina AI or LiveKit credentials 
(depending on your specific implementation)Microphone accessInstallationClone 

the repository:Bashgit clone https://github.com/jina-cloud/I_voice.lk.git

cd I_voice.lk

Set up a virtual environment:Bashpython -m venv venv

source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:Bashpip install -r requirements.txt

Configure Environment Variables:Create a .env file in the root directory:Code snippetLIVEKIT_URL=your_url

LIVEKIT_API_KEY=your_key

LIVEKIT_API_SECRET=your_secret

OPENAI_API_KEY=your_openai_key

🛠️ Technology StackComponentTechnologyOrchestrationJina / LiveKit AgentsSTTDeepgram / WhisperLLMGPT-4o / Claude 3.5TTSCartesia / ElevenLabsBackendPython / FastAPI📖 UsageTo start the voice agent server, run:Bashpython main.py
Once the server is running, you can connect via the web interface or a supported client to begin interacting with the AI.
🤝 ContributingContributions make the open-source community an amazing place to learn, inspire, and create.Fork 
the ProjectCreate your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)Open a Pull Request📄 LicenseDistributed under the MIT License. 

See LICENSE for more information.✉️ ContactThejan - @your_github_handleProject 

Link: https://github.com/jina-cloud/I_voice.

lkDeveloped with ❤️ in Sri Lanka
