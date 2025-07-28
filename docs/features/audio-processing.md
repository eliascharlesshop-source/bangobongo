# 🎛️ Audio Processing & Web Audio API

Complete guide to BangoBongo's professional audio processing system built on the Web Audio API, featuring a 10-band equalizer, real-time analysis, and high-quality audio playback.

## 🎯 Overview

BangoBongo implements a sophisticated audio processing pipeline using the Web Audio API to deliver studio-quality music playback with professional-grade controls and real-time audio analysis.

### 🎵 Key Features

- **Web Audio API Integration**: Professional audio processing with gain nodes and filters
- **10-Band Graphic Equalizer**: Full frequency spectrum control (32Hz - 16kHz)
- **High-Quality Audio Support**: Optimized for 320kbps MP3 playback
- **Real-time Analysis**: Buffer monitoring, waveform visualization, and quality detection
- **Advanced Volume Control**: Gain-based volume management with mute functionality
- **Professional Audio Chain**: Source → EQ → Gain → Analyser → Output

## 🏗️ Audio Architecture

### Audio Processing Chain

```
HTML5 Audio Element → Source Node → Input Gain → Equalizer Filters → Main Gain → Analyser → Destination
```

**Detailed Flow**:
1. **HTML5 Audio**: Loads and decodes MP3 files
2. **Source Node**: Creates MediaElementSourceNode from audio element
3. **Input Gain**: Pre-equalizer gain control
4. **10-Band EQ**: Biquad filters for frequency shaping
5. **Main Gain**: Post-equalizer volume control
6. **Analyser**: Real-time frequency and time-domain analysis
7. **Destination**: Final audio output to speakers/headphones

### Web Audio API Implementation

```typescript
// Initialize AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

// Create nodes
const sourceNode = audioContext.createMediaElementSource(audioElement)
const inputGain = audioContext.createGain()
const mainGain = audioContext.createGain()
const analyser = audioContext.createAnalyser()

// Create 10-band equalizer
const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
const equalizerFilters = frequencies.map((freq, index) => {
  const filter = audioContext.createBiquadFilter()
  
  if (freq <= 64) {
    filter.type = 'lowshelf'  // Bass frequencies
  } else if (freq >= 8000) {
    filter.type = 'highshelf' // Treble frequencies  
  } else {
    filter.type = 'peaking'   // Mid frequencies
  }
  
  filter.frequency.value = freq
  filter.Q.value = 1
  filter.gain.value = 0 // No boost/cut by default
  
  return filter
})

// Connect the audio chain
sourceNode.connect(inputGain)
inputGain.connect(equalizerFilters[0])

// Chain equalizer filters
for (let i = 0; i < equalizerFilters.length - 1; i++) {
  equalizerFilters[i].connect(equalizerFilters[i + 1])
}

// Complete the chain
equalizerFilters[equalizerFilters.length - 1].connect(mainGain)
mainGain.connect(analyser)
analyser.connect(audioContext.destination)
```

## 🎛️ 10-Band Graphic Equalizer

### Frequency Bands

| Band | Frequency | Filter Type | Purpose | Typical Use |
|------|-----------|-------------|---------|-------------|
| 1 | 32Hz | Low Shelf | Sub-bass | Deep bass extension |
| 2 | 64Hz | Peaking | Bass | Kick drum fundamentals |
| 3 | 125Hz | Peaking | Lower Mid | Bass warmth |
| 4 | 250Hz | Peaking | Mid-Bass | Body and fullness |
| 5 | 500Hz | Peaking | Mid-range | Vocal fundamentals |
| 6 | 1kHz | Peaking | Upper Mid | Vocal clarity |
| 7 | 2kHz | Peaking | Presence | Vocal intelligibility |
| 8 | 4kHz | Peaking | Clarity | Instrument definition |
| 9 | 8kHz | Peaking | Brilliance | High-frequency detail |
| 10 | 16kHz | High Shelf | Air | Sparkle and airiness |

### Equalizer Configuration

```typescript
interface EqualizerSettings {
  '32': number    // -12dB to +12dB
  '64': number    // -12dB to +12dB
  '125': number   // -12dB to +12dB
  '250': number   // -12dB to +12dB
  '500': number   // -12dB to +12dB
  '1000': number  // -12dB to +12dB
  '2000': number  // -12dB to +12dB
  '4000': number  // -12dB to +12dB
  '8000': number  // -12dB to +12dB
  '16000': number // -12dB to +12dB
  [key: string]: number
}

// Update equalizer band
const updateEqualizer = (frequency: string, gain: number) => {
  const index = frequencies.indexOf(parseInt(frequency))
  if (index !== -1 && equalizerFilters[index]) {
    equalizerFilters[index].gain.value = gain
  }
}
```

### Equalizer Presets

```typescript
const equalizerPresets = {
  flat: {
    '32': 0, '64': 0, '125': 0, '250': 0, '500': 0,
    '1000': 0, '2000': 0, '4000': 0, '8000': 0, '16000': 0
  },
  
  electronic: {
    '32': 4, '64': 3, '125': 1, '250': 0, '500': -1,
    '1000': 0, '2000': 2, '4000': 3, '8000': 4, '16000': 3
  },
  
  rock: {
    '32': 3, '64': 2, '125': -1, '250': -2, '500': 1,
    '1000': 2, '2000': 4, '4000': 3, '8000': 2, '16000': 1
  },
  
  vocal: {
    '32': -2, '64': -1, '125': 0, '250': 1, '500': 3,
    '1000': 4, '2000': 3, '4000': 2, '8000': 1, '16000': 0
  },
  
  bass_boost: {
    '32': 6, '64': 4, '125': 2, '250': 0, '500': -1,
    '1000': 0, '2000': 0, '4000': 0, '8000': 0, '16000': 0
  },
  
  treble_boost: {
    '32': 0, '64': 0, '125': 0, '250': 0, '500': 0,
    '1000': 1, '2000': 2, '4000': 4, '8000': 5, '16000': 6
  }
}
```

## 🔊 Volume & Gain Control

### Professional Volume Management

```typescript
// Gain-based volume control (better than HTML5 audio volume)
const setVolume = (volumePercent: number) => {
  // Convert percentage to gain (0-100% → 0-1 gain)
  const gainValue = Math.max(0, Math.min(1, volumePercent / 100))
  
  // Apply logarithmic scaling for natural volume response
  const logGain = gainValue === 0 ? 0 : Math.pow(gainValue, 1.5)
  
  if (mainGain) {
    mainGain.gain.value = logGain
  }
}

// Mute functionality
const toggleMute = () => {
  if (mainGain) {
    if (isMuted) {
      mainGain.gain.value = previousGainValue
    } else {
      previousGainValue = mainGain.gain.value
      mainGain.gain.value = 0
    }
    setIsMuted(!isMuted)
  }
}

// Smooth volume transitions
const fadeVolume = (fromGain: number, toGain: number, duration: number) => {
  if (!mainGain) return
  
  const startTime = audioContext.currentTime
  mainGain.gain.setValueAtTime(fromGain, startTime)
  mainGain.gain.linearRampToValueAtTime(toGain, startTime + duration)
}
```

## 📊 Real-time Audio Analysis

### Analyser Node Configuration

```typescript
// Configure analyser for real-time analysis
const setupAnalyser = () => {
  analyser.fftSize = 2048
  analyser.smoothingTimeConstant = 0.8
  analyser.minDecibels = -90
  analyser.maxDecibels = -10
  
  // Buffers for analysis data
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  const frequencyData = new Uint8Array(bufferLength)
  
  return { bufferLength, dataArray, frequencyData }
}

// Real-time frequency analysis
const getFrequencyData = () => {
  if (!analyser) return null
  
  const frequencyData = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(frequencyData)
  
  return frequencyData
}

// Real-time waveform analysis
const getWaveformData = () => {
  if (!analyser) return null
  
  const waveformData = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteTimeDomainData(waveformData)
  
  return waveformData
}
```

### Audio Quality Detection

```typescript
const detectAudioQuality = (audioElement: HTMLAudioElement) => {
  const audioTrack = audioElement.srcObject?.getAudioTracks()[0]
  
  if (audioTrack) {
    const settings = audioTrack.getSettings()
    return {
      sampleRate: settings.sampleRate || 44100,
      bitrate: estimateBitrate(audioElement),
      channels: settings.channelCount || 2,
      format: getAudioFormat(audioElement.src)
    }
  }
  
  // Fallback quality detection from file extension
  return detectQualityFromURL(audioElement.src)
}

const estimateBitrate = (audioElement: HTMLAudioElement): string => {
  // Estimate bitrate based on file size and duration
  const fileSize = audioElement.buffered.length > 0 ? 
    estimateFileSize(audioElement) : null
  
  if (fileSize && audioElement.duration) {
    const bitrate = (fileSize * 8) / audioElement.duration / 1000
    if (bitrate >= 280) return '320kbps'
    if (bitrate >= 220) return '256kbps'
    if (bitrate >= 160) return '192kbps'
    if (bitrate >= 112) return '128kbps'
  }
  
  return 'Unknown'
}
```

## 🔄 Buffer Monitoring

### Real-time Buffer Progress

```typescript
const updateBufferProgress = (audioElement: HTMLAudioElement) => {
  if (audioElement.buffered.length > 0) {
    const bufferedEnd = audioElement.buffered.end(audioElement.buffered.length - 1)
    const duration = audioElement.duration || 0
    
    const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0
    setBuffered(Math.min(100, bufferedPercent))
  }
}

// Monitor buffer health
const checkBufferHealth = (audioElement: HTMLAudioElement) => {
  const currentTime = audioElement.currentTime
  
  for (let i = 0; i < audioElement.buffered.length; i++) {
    const start = audioElement.buffered.start(i)
    const end = audioElement.buffered.end(i)
    
    if (currentTime >= start && currentTime <= end) {
      const bufferAhead = end - currentTime
      return {
        isHealthy: bufferAhead > 5, // 5 seconds ahead
        bufferAhead,
        bufferStart: start,
        bufferEnd: end
      }
    }
  }
  
  return { isHealthy: false, bufferAhead: 0 }
}
```

## 🎵 Audio File Optimization

### Recommended Audio Specifications

**Optimal Settings**:
- **Format**: MP3 (best compatibility)
- **Bitrate**: 320kbps CBR (Constant Bit Rate)
- **Sample Rate**: 44.1kHz (CD quality)
- **Channels**: Stereo (2 channels)
- **File Size**: Under 10MB per track

**Encoding Guidelines**:
```bash
# FFmpeg encoding for optimal web playback
ffmpeg -i input.wav -codec:a libmp3lame -b:a 320k -ar 44100 -ac 2 -joint_stereo 0 output.mp3

# Ensure consistent volume levels
ffmpeg -i input.mp3 -af loudnorm=I=-16:LRA=11:TP=-1.5 -c:a libmp3lame -b:a 320k output_normalized.mp3
```

### Audio File Validation

```typescript
const validateAudioFile = async (audioFile: File): Promise<{
  valid: boolean
  errors: string[]
  metadata: AudioMetadata
}> => {
  const errors: string[] = []
  
  // Check file format
  if (!audioFile.type.startsWith('audio/')) {
    errors.push('File must be an audio file')
  }
  
  // Check file size (max 10MB)
  if (audioFile.size > 10 * 1024 * 1024) {
    errors.push('File size must be under 10MB')
  }
  
  // Check file extension
  const extension = audioFile.name.split('.').pop()?.toLowerCase()
  if (!['mp3', 'wav', 'flac', 'm4a'].includes(extension || '')) {
    errors.push('Supported formats: MP3, WAV, FLAC, M4A')
  }
  
  // Load and analyze audio metadata
  const metadata = await extractAudioMetadata(audioFile)
  
  // Validate bitrate
  if (metadata.bitrate && metadata.bitrate < 128) {
    errors.push('Minimum bitrate: 128kbps (320kbps recommended)')
  }
  
  // Validate sample rate
  if (metadata.sampleRate && metadata.sampleRate < 44100) {
    errors.push('Minimum sample rate: 44.1kHz')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    metadata
  }
}
```

## 🎚️ Advanced Audio Effects

### Crossfading Implementation

```typescript
const crossfadeToTrack = async (
  currentAudio: HTMLAudioElement,
  nextAudio: HTMLAudioElement,
  crossfadeTime: number = 3
) => {
  if (!audioContext || !mainGain) return
  
  // Create separate gain nodes for crossfading
  const currentGain = audioContext.createGain()
  const nextGain = audioContext.createGain()
  
  // Setup audio chains
  const currentSource = audioContext.createMediaElementSource(currentAudio)
  const nextSource = audioContext.createMediaElementSource(nextAudio)
  
  currentSource.connect(currentGain)
  nextSource.connect(nextGain)
  
  currentGain.connect(mainGain)
  nextGain.connect(mainGain)
  
  // Start next track
  nextAudio.play()
  
  // Crossfade automation
  const startTime = audioContext.currentTime
  const fadeTime = crossfadeTime
  
  // Fade out current track
  currentGain.gain.setValueAtTime(1, startTime)
  currentGain.gain.linearRampToValueAtTime(0, startTime + fadeTime)
  
  // Fade in next track
  nextGain.gain.setValueAtTime(0, startTime)
  nextGain.gain.linearRampToValueAtTime(1, startTime + fadeTime)
  
  // Stop current track after fade
  setTimeout(() => {
    currentAudio.pause()
    currentAudio.currentTime = 0
  }, fadeTime * 1000)
}
```

### Dynamic Range Compression

```typescript
const setupCompressor = () => {
  const compressor = audioContext.createDynamicsCompressor()
  
  // Configure compressor settings
  compressor.threshold.value = -24  // dB
  compressor.knee.value = 30        // dB
  compressor.ratio.value = 12       // 12:1 ratio
  compressor.attack.value = 0.003   // 3ms
  compressor.release.value = 0.25   // 250ms
  
  // Insert into audio chain (after EQ, before main gain)
  equalizerFilters[equalizerFilters.length - 1].disconnect()
  equalizerFilters[equalizerFilters.length - 1].connect(compressor)
  compressor.connect(mainGain)
  
  return compressor
}
```

### Reverb Effect

```typescript
const createReverb = async () => {
  const convolver = audioContext.createConvolver()
  
  // Create impulse response for reverb
  const impulseResponse = await createImpulseResponse(
    audioContext.sampleRate * 2, // 2 seconds
    audioContext.sampleRate,
    0.3 // decay
  )
  
  convolver.buffer = impulseResponse
  
  return convolver
}

const createImpulseResponse = (
  length: number,
  sampleRate: number,
  decay: number
): AudioBuffer => {
  const impulse = audioContext.createBuffer(2, length, sampleRate)
  
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel)
    
    for (let i = 0; i < length; i++) {
      const n = length - i
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, decay)
    }
  }
  
  return impulse
}
```

## 📱 Mobile Optimization

### Touch Controls

```typescript
// Touch-friendly volume control
const handleTouchVolume = (touchEvent: TouchEvent) => {
  const touch = touchEvent.touches[0]
  const rect = volumeSlider.getBoundingClientRect()
  const y = touch.clientY - rect.top
  const height = rect.height
  
  const volumePercent = Math.max(0, Math.min(100, ((height - y) / height) * 100))
  setVolume(volumePercent)
}

// Gesture-based seeking
const handleSeekGesture = (gestureEvent: any) => {
  const seekTime = audioElement.currentTime + (gestureEvent.deltaX * 0.1)
  const clampedTime = Math.max(0, Math.min(audioElement.duration, seekTime))
  audioElement.currentTime = clampedTime
}
```

### Mobile Audio Context

```typescript
// Handle mobile autoplay restrictions
const initializeMobileAudio = async () => {
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume()
      console.log('AudioContext resumed on user interaction')
    } catch (error) {
      console.error('Failed to resume AudioContext:', error)
    }
  }
}

// Add user interaction listeners for mobile
document.addEventListener('touchstart', initializeMobileAudio, { once: true })
document.addEventListener('click', initializeMobileAudio, { once: true })
```

## 🔧 Performance Optimization

### Memory Management

```typescript
// Cleanup audio resources
const cleanupAudioResources = () => {
  // Disconnect all nodes
  sourceNode?.disconnect()
  inputGain?.disconnect()
  equalizerFilters.forEach(filter => filter?.disconnect())
  mainGain?.disconnect()
  analyser?.disconnect()
  
  // Clear references
  sourceNode = null
  inputGain = null
  equalizerFilters.length = 0
  mainGain = null
  analyser = null
}

// Monitor memory usage
const monitorAudioMemory = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    console.log('Audio Context Memory:', {
      used: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      allocated: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      limit: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + ' MB'
    })
  }
}
```

### Audio Preloading

```typescript
// Intelligent audio preloading
const preloadNextTrack = (trackIndex: number) => {
  const nextIndex = (trackIndex + 1) % tracks.length
  const nextTrack = tracks[nextIndex]
  
  if (nextTrack && !preloadedAudio.has(nextTrack.id)) {
    const audio = new Audio(nextTrack.audioUrl)
    audio.preload = 'metadata'
    
    // Preload first few seconds
    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = 0
      audio.load()
    })
    
    preloadedAudio.set(nextTrack.id, audio)
  }
}
```

## 🧪 Testing Audio Features

### Audio Testing Suite

```typescript
// Test equalizer functionality
const testEqualizer = async () => {
  console.log('Testing equalizer...')
  
  // Test each frequency band
  for (const freq of Object.keys(equalizerSettings)) {
    updateEqualizer(freq, 6)  // +6dB boost
    await new Promise(resolve => setTimeout(resolve, 500))
    updateEqualizer(freq, -6) // -6dB cut
    await new Promise(resolve => setTimeout(resolve, 500))
    updateEqualizer(freq, 0)  // Reset
  }
  
  console.log('Equalizer test complete')
}

// Test audio chain integrity
const testAudioChain = () => {
  const tests = [
    () => sourceNode?.context === audioContext,
    () => inputGain?.context === audioContext,
    () => equalizerFilters.every(f => f?.context === audioContext),
    () => mainGain?.context === audioContext,
    () => analyser?.context === audioContext
  ]
  
  const results = tests.map((test, i) => ({
    test: i + 1,
    passed: test()
  }))
  
  console.log('Audio chain tests:', results)
  return results.every(r => r.passed)
}
```

## 📊 Analytics & Monitoring

### Audio Analytics

```typescript
// Track audio performance metrics
const trackAudioMetrics = () => {
  const metrics = {
    timestamp: Date.now(),
    trackId: currentTrack?.id,
    audioContext: {
      state: audioContext.state,
      sampleRate: audioContext.sampleRate,
      currentTime: audioContext.currentTime
    },
    playback: {
      currentTime: audioElement.currentTime,
      duration: audioElement.duration,
      buffered: getBufferedRanges(),
      quality: audioQuality
    },
    equalizer: { ...equalizerSettings },
    volume: volume,
    isMuted: isMuted
  }
  
  // Send to analytics service
  sendAudioAnalytics(metrics)
}

// Monitor audio errors
const monitorAudioErrors = () => {
  audioElement.addEventListener('error', (event) => {
    const error = {
      type: 'audio_playback_error',
      code: audioElement.error?.code,
      message: audioElement.error?.message,
      trackId: currentTrack?.id,
      timestamp: Date.now()
    }
    
    console.error('Audio error:', error)
    sendErrorReport(error)
  })
}
```

## 🔍 Troubleshooting

### Common Issues

**1. No Audio Output**
- Check if AudioContext is suspended (mobile autoplay)
- Verify audio file format and codec support
- Ensure gain nodes are connected properly

**2. Equalizer Not Working**
- Verify biquad filter types and frequencies
- Check filter connections in audio chain
- Ensure gain values are within valid range (-40dB to +40dB)

**3. Performance Issues**
- Monitor memory usage with multiple tracks
- Use audio preloading strategically
- Clean up unused audio resources

**4. Mobile Audio Problems**
- Handle autoplay restrictions properly
- Use touch events to resume AudioContext
- Optimize for mobile hardware limitations

### Debug Tools

```typescript
// Audio debugging utility
const debugAudioSystem = () => {
  console.group('Audio System Debug')
  
  console.log('AudioContext:', {
    state: audioContext?.state,
    sampleRate: audioContext?.sampleRate,
    currentTime: audioContext?.currentTime
  })
  
  console.log('Audio Element:', {
    src: audioElement?.src,
    currentTime: audioElement?.currentTime,
    duration: audioElement?.duration,
    paused: audioElement?.paused,
    ended: audioElement?.ended
  })
  
  console.log('Audio Nodes:', {
    sourceNode: !!sourceNode,
    inputGain: !!inputGain,
    equalizerFilters: equalizerFilters.length,
    mainGain: !!mainGain,
    analyser: !!analyser
  })
  
  console.log('Equalizer Settings:', equalizerSettings)
  console.log('Volume:', volume, 'Muted:', isMuted)
  
  console.groupEnd()
}
```

---

## 📚 Further Reading

- **[Web Audio API Specification](https://webaudio.github.io/web-audio-api/)**
- **[Audio Processing Best Practices](../development/audio-best-practices.md)**
- **[Mobile Audio Guidelines](../development/mobile-audio.md)**
- **[Performance Optimization](../deployment/performance.md)**

**Ready to enhance your audio experience?** Check out our [music player implementation guide](./music-player-complete.md) to see these concepts in action!
