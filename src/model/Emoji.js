const imgPath = 'emoji/';

// https://emojiisland.com/pages/free-download-emoji-icons-png

const emoji = [
    'Alien_Emoji_42x42.png',
    'Anguished_Face_Emoji_42x42.png',
    'Astonished_Face_Emoji_42x42.png',
    'Cold_Sweat_Emoji_42x42.png',
    'Dizzy_Face_Emoji_42x42.png',
    'Emoji_Face_without_Mouth_42x42.png',
    'Face_With_Rolling_Eyes_Emoji_42x42.png',
    'Face_With_Thermometer_Emoji_42x42.png',
    'Fearful_Face_Emoji_42x42.png',
    'Hugging_Face_Emoji_42x42.png',
    'Hungry_Face_Emoji_42x42.png',
    'Hushed_Face_Emoji_42x42.png',
    'Loudly_Crying_Face_Emoji_42x42.png',
    'Money_Face_Emoji_Icon_42x42.png',
    'Poop_Emoji_42x42.png',
    'Shyly_Smiling_Face_Emoji_42x42.png',
    'Sleeping_with_Snoring_Emoji_42x42.png',
    'Slightly_Smiling_Face_Emoji_Icon_42x42.png',
    'Sunglasses_Emoji_42x42.png',
    'Surprised_Face_Emoji_42x42.png',
    'Thinking_Face_Emoji_42x42.png',
    'Tongue_Out_Emoji_with_Tightly_Closed_Eyes_Icon_42x42.png',
    'Tongue_Out_Emoji_with_Winking_Eye_Icon_42x42.png',
    'Very_Angry_Emoji_42x42.png',
    'Wink_Emoji_42x42.png',
    'Zipper-Mouth_Face_Emoji_42x42.png',
].map(item => `${imgPath}${item}`);

export default {
    emoji,
    random: () => {
        const v = emoji[Math.floor(Math.random() * emoji.length)];
        return v;
    },
}