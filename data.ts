export interface Card {
    from: string
    to: string
    image_url: string
    audio_url: string
    description: string
}

export interface BuildSentenceQuestion {
    sentence: string
    correctAnswer: string
    options: string[]
}

export interface MatchingQuestion {
    wordsFrom: { id: string; text: string }[]
    wordsTo: { id: string; text: string }[]
}

export interface MatchingStep {
    type: 'matching'
    data: MatchingQuestion[]
}

export interface MultipleChoiceQuestion {
    type: 'multipleChoice'
    word: string
    image_url: string
    audio_url: string
    translations: string[]
    correctWord: string
}

interface CardsStep {
    type: 'cards'
    data: Card[]
}

interface MultipleChoiceStep {
    type: 'multipleChoice'
    data: MultipleChoiceQuestion[]
}

interface BuildSentenceStep {
    type: 'buildSentence'
    data: BuildSentenceQuestion[]
}

interface FinishStep {
    type: 'finish'
}

type LessonStep =
    | CardsStep
    | MultipleChoiceStep
    | MatchingStep
    | BuildSentenceStep
    | FinishStep

interface Lesson {
    video: {
        href: string
    }
    [stepNumber: number]: LessonStep
}

interface LessonsData {
    [lessonId: string]: Lesson
}

export const dataEn: LessonsData = {
    'c807e076-8ee0-46ee-a2e7-ed5b87dffca0': {
        video: {
            href: 'https://app.heygen.com/embeds/4dd02802245f45909d092aad7d0458c7',
        },
        1: {
            type: 'cards',
            data: [
                {
                    from: 'Hello!',
                    to: 'Tere!',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                    description: 'A common informal greeting.',
                },
                {
                    from: 'Good day!',
                    to: 'Tere päevast!',
                    description: 'A more formal greeting used during the day.',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                },
                {
                    from: 'Good morning!',
                    to: 'Tere hommikust!',
                    description: 'A morning greeting.',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                },
                {
                    from: 'How are you?',
                    to: 'Kuidas läheb?',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                    description:
                        'A question about the well-being of the person being addressed.',
                },
                {
                    from: 'Good!',
                    to: 'Hästi!',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                    description:
                        "A response to the question about one's well-being.",
                },
                {
                    from: 'Good evening!',
                    to: 'Tere õhtust!',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                    description: 'A greeting used in the evening.',
                },
            ],
        },
        2: {
            type: 'multipleChoice',
            data: [
                {
                    word: 'Tere',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                    translations: ['Goodbye', 'Hello', 'Good morning'],
                    correctWord: 'Hello',
                    type: 'multipleChoice',
                },
                {
                    word: 'Kuidas läheb?',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                    translations: [
                        'Where are you?',
                        'Who are you?',
                        'How are you?',
                    ],
                    correctWord: 'How are you?',
                    type: 'multipleChoice',
                },
                {
                    word: 'Hästi!',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                    translations: ['Hello!', 'Good!', 'Good day!'],
                    correctWord: 'Good!',
                    type: 'multipleChoice',
                },
                {
                    word: 'Tere Hommikust!',
                    translations: ['Good evening', 'Hello', 'Good morning!'],
                    correctWord: 'Good morning!',
                    type: 'multipleChoice',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                },
                {
                    word: 'Tere õhtust',
                    translations: ['Good evening', 'Hello', 'Goodbye'],
                    correctWord: 'Good evening',
                    type: 'multipleChoice',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                },
                {
                    word: 'Tere päevast!',
                    translations: ['Good evening', 'Good day!', 'Goodbye!'],
                    correctWord: 'Good day!',

                    type: 'multipleChoice',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                },
            ],
        },
        3: {
            type: 'multipleChoice',
            data: [
                {
                    word: 'Hello',
                    type: 'multipleChoice',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                    translations: ['Tere', 'Head aega', 'Tere hommikust'],
                    correctWord: 'Tere',
                },
                {
                    word: 'How are you?',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                    type: 'multipleChoice',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                    translations: [
                        'Kuidas läheb?',
                        'Kes sa oled?',
                        'Kuhu lähed?',
                    ],
                    correctWord: 'Kuidas läheb?',
                },
                {
                    word: 'Good!',
                    type: 'multipleChoice',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                    translations: ['Tere!', 'Hästi!', 'Tere päevast!'],
                    correctWord: 'Hästi!',
                },
                {
                    word: 'Good morning!',
                    type: 'multipleChoice',
                    translations: ['Tere hommikust', 'Tere õhtust', 'Head ööd'],
                    correctWord: 'Tere hommikust',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                },
                {
                    word: 'Good evening',
                    type: 'multipleChoice',
                    translations: ['Tere õhtust', 'Tere päevast', 'Head aega'],
                    correctWord: 'Tere õhtust',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                },
                {
                    word: 'Good afternoon!',
                    type: 'multipleChoice',
                    translations: [
                        'Tere päevast',
                        'Tere hommikust',
                        'Head aega',
                    ],
                    correctWord: 'Tere päevast',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                },
            ],
        },
        4: {
            type: 'matching',
            data: [
                {
                    wordsFrom: [
                        { id: '1', text: 'Hello' },
                        { id: '2', text: 'How are you' },
                        { id: '3', text: 'Good' },
                        { id: '4', text: 'Good morning' },
                    ],
                    wordsTo: [
                        { id: '1', text: 'Tere' },
                        { id: '2', text: 'Kuidas läheb?' },
                        { id: '3', text: 'Hästi!' },
                        { id: '4', text: 'Tere hommikust' },
                    ],
                },
            ],
        },
        5: {
            type: 'buildSentence',
            data: [
                {
                    sentence: 'Hello! ____',
                    correctAnswer: 'Tere!',
                    options: [
                        'Tere!',
                        'Tere päevast!',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Good day! ____',
                    correctAnswer: 'Tere päevast!',
                    options: [
                        'Tere!',
                        'Tere päevast!',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Good morning! ____',
                    correctAnswer: 'Tere hommikust!',
                    options: [
                        'Tere hommikust!',
                        'Hästi!',
                        'Tere õhtust!',
                        'Tere!',
                    ],
                },
                {
                    sentence: 'How are you? ____',
                    correctAnswer: 'Kuidas läheb?',
                    options: [
                        'Tere!',
                        'Kuidas läheb?',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Good! ____',
                    correctAnswer: 'Hästi!',
                    options: [
                        'Tere!',
                        'Tere hommikust!',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Good evening! ____',
                    correctAnswer: 'Tere õhtust!',
                    options: [
                        'Tere õhtust!',
                        'Tere hommikust!',
                        'Hästi!',
                        'Tere!',
                    ],
                },
            ],
        },
        6: {
            type: 'finish',
        },
    },
}

export const dataRu: LessonsData = {
    'c807e076-8ee0-46ee-a2e7-ed5b87dffca0': {
        video: {
            href: 'https://app.heygen.com/embeds/7cecce1c8c1d46c389425dc2889cc356',
        },
        1: {
            type: 'cards',
            data: [
                {
                    from: 'Здравствуйте!',
                    to: 'Tere!',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                    description: 'Обычное формальное приветсиве',
                },
                {
                    from: 'Добрый день!',
                    to: 'Tere päevast!',
                    description:
                        'Более формальное приветствие. Используется днем',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                },
                {
                    from: 'Доброе утро!',
                    to: 'Tere hommikust!',
                    description: 'Приветсвие утром',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                },
                {
                    from: 'Как дела?',
                    to: 'Kuidas läheb?',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                    description: 'Вопрос об общем состоянии человека',
                },
                {
                    from: 'Хорошо!',
                    to: 'Hästi!',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                    description: 'Ответ на вопрос об общем состоянии человека',
                },
                {
                    from: 'Добрый вечер!',
                    to: 'Tere õhtust!',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                    description: 'Приветсвие используемое вечером',
                },
            ],
        },
        2: {
            type: 'multipleChoice',
            data: [
                {
                    word: 'Tere',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                    translations: [
                        'До свидания',
                        'Здравствуйте',
                        'Доброе утро',
                    ],
                    correctWord: 'Здравствуйте',
                    type: 'multipleChoice',
                },
                {
                    word: 'Kuidas läheb?',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                    translations: ['Где ты?', 'Кто ты?', 'Как дела?'],
                    correctWord: 'Как дела?',
                    type: 'multipleChoice',
                },
                {
                    word: 'Hästi!',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                    translations: ['Привет!', 'Хорошо!', 'Добрый день!'],
                    correctWord: 'Хорошо!',
                    type: 'multipleChoice',
                },
                {
                    word: 'Tere Hommikust!',
                    translations: ['Добрый вечер', 'Привет', 'Доброе утро'],
                    correctWord: 'Доброе утро',
                    type: 'multipleChoice',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                },
                {
                    word: 'Tere õhtust',
                    translations: ['Добрый вечер', 'Привет', 'До свидания'],
                    correctWord: 'Добрый вечер',
                    type: 'multipleChoice',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                },
                {
                    word: 'Tere päevast!',
                    translations: [
                        'Добрый вечер',
                        'Добрый день',
                        'До свидания',
                    ],
                    correctWord: 'Добрый день',
                    type: 'multipleChoice',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                },
            ],
        },

        3: {
            type: 'multipleChoice',
            data: [
                {
                    word: 'Здравствуйте',
                    type: 'multipleChoice',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                    translations: ['Tere', 'Head aega', 'Tere hommikust'],
                    correctWord: 'Tere',
                },
                {
                    word: 'Как дела?',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                    type: 'multipleChoice',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                    translations: [
                        'Kuidas läheb?',
                        'Kes sa oled?',
                        'Kuhu lähed?',
                    ],
                    correctWord: 'Kuidas läheb?',
                },
                {
                    word: 'Хорошо!',
                    type: 'multipleChoice',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                    translations: ['Tere!', 'Hästi!', 'Tere päevast!'],
                    correctWord: 'Hästi!',
                },
                {
                    word: 'Доброе утро!',
                    type: 'multipleChoice',
                    translations: ['Tere hommikust', 'Tere õhtust', 'Head ööd'],
                    correctWord: 'Tere hommikust',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                },
                {
                    word: 'Добрый вечер',
                    type: 'multipleChoice',
                    translations: ['Tere õhtust', 'Tere päevast', 'Head aega'],
                    correctWord: 'Tere õhtust',
                    audio_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                },
                {
                    word: 'Добрый день!',
                    type: 'multipleChoice',
                    translations: [
                        'Tere päevast',
                        'Tere hommikust',
                        'Head aega',
                    ],
                    correctWord: 'Tere päevast',
                    audio_url: 'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                    image_url:
                        'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                },
            ],
        },
        4: {
            type: 'matching',
            data: [
                {
                    wordsFrom: [
                        { id: '1', text: 'Здравствйте' },
                        { id: '2', text: 'Как дела' },
                        { id: '3', text: 'Хорошо' },
                        { id: '4', text: 'Доброе утро' },
                    ],
                    wordsTo: [
                        { id: '1', text: 'Tere' },
                        { id: '2', text: 'Kuidas läheb' },
                        { id: '3', text: 'Hästi' },
                        { id: '4', text: 'Tere hommikust' },
                    ],
                },
            ],
        },
        5: {
            type: 'buildSentence',
            data: [
                {
                    sentence: 'Здравствуйте! ____',
                    correctAnswer: 'Tere!',
                    options: [
                        'Tere!',
                        'Tere päevast!',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Добрый день! ____',
                    correctAnswer: 'Tere päevast!',
                    options: [
                        'Tere!',
                        'Tere päevast!',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Доброе утро! ____',
                    correctAnswer: 'Tere hommikust!',
                    options: [
                        'Tere hommikust!',
                        'Hästi!',
                        'Tere õhtust!',
                        'Tere!',
                    ],
                },
                {
                    sentence: 'Как дела? ____',
                    correctAnswer: 'Kuidas läheb',
                    options: ['Tere!', 'Kuidas läheb', 'Hästi', 'Tere õhtust'],
                },
                {
                    sentence: 'Хорошо! ____',
                    correctAnswer: 'Hästi!',
                    options: [
                        'Tere!',
                        'Tere hommikust!',
                        'Hästi!',
                        'Tere õhtust!',
                    ],
                },
                {
                    sentence: 'Добрый вечер! ____',
                    correctAnswer: 'Tere õhtust!',
                    options: [
                        'Tere õhtust!',
                        'Tere hommikust!',
                        'Hästi!',
                        'Tere!',
                    ],
                },
            ],
        },
        6: {
            type: 'finish',
        },
    },
}

export const dataNew = {
    'c807e076-8ee0-46ee-a2e7-ed5b87dffca0': {
        video: {
            href: 'https://app.heygen.com/embeds/7cecce1c8c1d46c389425dc2889cc356',
        },
        1: {
            title: 'Tervitused ja hüvastijätud',
            exercises: [
                {
                    type: 'Learn words with cards',
                    data: [
                        {
                            id: '1',
                            from: 'Здравствуйте!',
                            to: 'Tere!',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                            description: 'Обычное формальное приветсиве',
                        },
                        {
                            id: '2',
                            from: 'Добрый день!',
                            to: 'Tere päevast!',
                            description:
                                'Более формальное приветствие. Используется днем',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                        },
                        {
                            id: '3',
                            from: 'Доброе утро!',
                            to: 'Tere hommikust!',
                            description: 'Приветсвие утром',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                        },
                        {
                            id: '4',
                            from: 'Как дела?',
                            to: 'Kuidas läheb?',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                            description: 'Вопрос об общем состоянии человека',
                        },
                        {
                            id: '5',
                            from: 'Хорошо!',
                            to: 'Hästi!',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                            description:
                                'Ответ на вопрос об общем состоянии человека',
                        },
                        {
                            id: '6',
                            from: 'Добрый вечер!',
                            to: 'Tere õhtust!',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                            description: 'Приветсвие используемое вечером',
                        },
                    ],
                },
                {
                    type: 'Choose the correct translation in your language',
                    data: [
                        {
                            word: 'Tere',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                            translations: [
                                'До свидания',
                                'Здравствуйте',
                                'Доброе утро',
                            ],
                            correctWord: 'Здравствуйте',
                            type: 'multipleChoice',
                        },
                        {
                            word: 'Kuidas läheb?',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                            translations: ['Где ты?', 'Кто ты?', 'Как дела?'],
                            correctWord: 'Как дела?',
                            type: 'multipleChoice',
                        },
                        {
                            word: 'Hästi!',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                            translations: [
                                'Привет!',
                                'Хорошо!',
                                'Добрый день!',
                            ],
                            correctWord: 'Хорошо!',
                            type: 'multipleChoice',
                        },
                        {
                            word: 'Tere Hommikust!',
                            translations: [
                                'Добрый вечер',
                                'Привет',
                                'Доброе утро',
                            ],
                            correctWord: 'Доброе утро',
                            type: 'multipleChoice',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                        },
                        {
                            word: 'Tere õhtust',
                            translations: [
                                'Добрый вечер',
                                'Привет',
                                'До свидания',
                            ],
                            correctWord: 'Добрый вечер',
                            type: 'multipleChoice',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                        },
                        {
                            word: 'Tere päevast!',
                            translations: [
                                'Добрый вечер',
                                'Добрый день',
                                'До свидания',
                            ],
                            correctWord: 'Добрый день',
                            type: 'multipleChoice',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                        },
                    ],
                },

                {
                    type: 'Choose the correct translation in language you study',
                    data: [
                        {
                            word: 'Здравствуйте',
                            type: 'multipleChoice',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_1.png?alt=media&token=78bed978-afe7-4c69-9816-00bd71141f16',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0043.mp3',
                            translations: [
                                'Tere',
                                'Head aega',
                                'Tere hommikust',
                            ],
                            correctWord: 'Tere',
                        },
                        {
                            word: 'Как дела?',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0045.mp3',
                            type: 'multipleChoice',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FhowIsGoing.jpeg?alt=media&token=d2fd54bd-512a-46a3-bd7b-dfe65387c0b7',
                            translations: [
                                'Kuidas läheb?',
                                'Kes sa oled?',
                                'Kuhu lähed?',
                            ],
                            correctWord: 'Kuidas läheb?',
                        },
                        {
                            word: 'Хорошо!',
                            type: 'multipleChoice',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fh%C3%A4sti%20.mp3?alt=media&token=f43375ae-3581-42bf-a089-a4ed68155ec7',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fgood.jpeg?alt=media&token=c7cd5196-a73f-4e1c-9941-6d28d23a38b0',
                            translations: ['Tere!', 'Hästi!', 'Tere päevast!'],
                            correctWord: 'Hästi!',
                        },
                        {
                            word: 'Доброе утро!',
                            type: 'multipleChoice',
                            translations: [
                                'Tere hommikust',
                                'Tere õhtust',
                                'Head ööd',
                            ],
                            correctWord: 'Tere hommikust',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20hommikust!.mp3?alt=media&token=9f73128f-5552-4117-bba1-64e88c083a3e',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fmorning.png?alt=media&token=19595786-ead5-4479-9154-de8da1e5142d',
                        },
                        {
                            word: 'Добрый вечер',
                            type: 'multipleChoice',
                            translations: [
                                'Tere õhtust',
                                'Tere päevast',
                                'Head aega',
                            ],
                            correctWord: 'Tere õhtust',
                            audio_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2FTere%20%C3%B5htust!.mp3?alt=media&token=8c325087-82cb-4d53-9f10-6b433a0c8793',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fevening.png?alt=media&token=55b07c69-705e-480a-ab1d-dd898cb8fa45',
                        },
                        {
                            word: 'Добрый день!',
                            type: 'multipleChoice',
                            translations: [
                                'Tere päevast',
                                'Tere hommikust',
                                'Head aega',
                            ],
                            correctWord: 'Tere päevast',
                            audio_url:
                                'https://www.book2.nl/book2/ET/SOUND/0044.mp3',
                            image_url:
                                'https://firebasestorage.googleapis.com/v0/b/keelefy.appspot.com/o/lesson1%2Fhello_2.png?alt=media&token=7a28a257-8d06-4888-8ba9-f076c920d16c',
                        },
                    ],
                },
                {
                    type: 'Matching',
                    data: [
                        {
                            wordsFrom: [
                                { id: '1', text: 'Здравствйте' },
                                { id: '2', text: 'Как дела' },
                                { id: '3', text: 'Хорошо' },
                                { id: '4', text: 'Доброе утро' },
                            ],
                            wordsTo: [
                                { id: '1', text: 'Tere' },
                                { id: '2', text: 'Kuidas läheb' },
                                { id: '3', text: 'Hästi' },
                                { id: '4', text: 'Tere hommikust' },
                            ],
                        },
                    ],
                },
                {
                    type: 'Build a sentence',
                    data: [
                        {
                            sentence: 'Здравствуйте! ____',
                            correctAnswer: 'Tere!',
                            options: [
                                'Tere!',
                                'Tere päevast!',
                                'Hästi!',
                                'Tere õhtust!',
                            ],
                        },
                        {
                            sentence: 'Добрый день! ____',
                            correctAnswer: 'Tere päevast!',
                            options: [
                                'Tere!',
                                'Tere päevast!',
                                'Hästi!',
                                'Tere õhtust!',
                            ],
                        },
                        {
                            sentence: 'Доброе утро! ____',
                            correctAnswer: 'Tere hommikust!',
                            options: [
                                'Tere hommikust!',
                                'Hästi!',
                                'Tere õhtust!',
                                'Tere!',
                            ],
                        },
                        {
                            sentence: 'Как дела? ____',
                            correctAnswer: 'Kuidas läheb',
                            options: [
                                'Tere!',
                                'Kuidas läheb',
                                'Hästi',
                                'Tere õhtust',
                            ],
                        },
                        {
                            sentence: 'Хорошо! ____',
                            correctAnswer: 'Hästi!',
                            options: [
                                'Tere!',
                                'Tere hommikust!',
                                'Hästi!',
                                'Tere õhtust!',
                            ],
                        },
                        {
                            sentence: 'Добрый вечер! ____',
                            correctAnswer: 'Tere õhtust!',
                            options: [
                                'Tere õhtust!',
                                'Tere hommikust!',
                                'Hästi!',
                                'Tere!',
                            ],
                        },
                    ],
                },
            ],
        },
        2: {
            title: 'Методические принципы говорения (Methodical communication principles)',
        },
    },
}
