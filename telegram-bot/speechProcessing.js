const axios = require('axios')
const { Deepgram } = require('@deepgram/sdk');

const DG = new Deepgram(process.env.DEEPGRAM_API_KEY)

const performSpeechToText = async (voiceBuffer) => {
    const transcript = await DG.transcription.preRecorded(
        { buffer: voiceBuffer.data, mimetype: "audio/ogg" },
        { punctuate: true, language: 'en-US' },
    );

    const data = transcript.results.channels
        .flatMap((x) => x.alternatives)
        .map((x) => {
            return {
                confidence: x.confidence,
                transcript: x.transcript
            }
        })

    data.sort((a, b) => a.confidence - b.confidence)

    if (data.length > 0) return data[data.length - 1]
    return null
}

const processVoiceMessage = async ({ href }) => {
    const response = await axios.get(href, { responseType: "arraybuffer" });
    return await performSpeechToText(response);
}

module.exports = {
    processVoiceMessage
}