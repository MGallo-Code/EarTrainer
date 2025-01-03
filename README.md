# EarTrainer

EarTrainer is a Python-based ear training application designed to help musicians develop relative pitch skills. It features multiple interval quiz modes, flexible difficulty, and an interface that uses typed commands to navigate and guess intervals.

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Quiz Modes](#quiz-modes)
6. [Contributing](#contributing)
7. [License](#license)

## Overview

EarTrainer helps you practice recognizing intervals by ear. The program plays two successive notes, and you guess the interval. The idea is that over time, you’ll improve your ability to identify intervals using relative pitch recognition.

- Note.py handles note generation and playback.
- music_utils.py contains useful dictionaries and scale definitions.
- quiz.py handles the interval quiz logic and user interaction.
- main.py can run the quiz or other demos.
- test.py contains some simple code testing sound playback.

## Features

1. **Multiple Quiz Modes**
    - Test major scale intervals in a single octave (basic_single_octave).
	- Test all intervals within a single octave (full_single_octave).
	- Test major scale intervals across multiple octaves (basic_multiple_octaves).
2. **Flexible Input**
	- You can type short codes for intervals (e.g., 2m for minor 2nd, 3 for major 3rd, tritone for a 6-semitone interval, etc.).
	- Optionally keep track of interval semitones if you’re a guitarist or pianist.
3. **Interactive Menus**
	- A main menu allows you to select quiz modes or exit.
	- You can keep playing rounds until you decide to return to the main menu or exit.

## Installation

1. Clone or Download the repository:

```bash
git clone https://github.com/MGallo-Code/EarTrainer.git
cd EarTrainer
```


2. Create a Virtual Environment (recommended):

```bash
python -m venv venv
source venv/bin/activate
# On Windows: venv\Scripts\activate
```

3. Install Dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. **Run the Main Application:**

```bash
python main.py
```

or if you’re using the integrated quiz application:

```bash
python -m quiz
```

2. **Main Menu:**
When you start the quiz (via run_quiz_app() in quiz.py or from your main.py), you’ll see a menu like:

```
1. basic_single_octave - Major scale intervals (single octave)
2. full_single_octave - Any interval from 1 to 12 semitones (single octave)
3. basic_multiple_octaves - Major scale intervals, in any octave between 3 and 5
4. Exit the Quiz App
```

Type the number corresponding to the mode you want to practice, then select how many rounds you want to attempt.

3. **Answering Interval Prompts:**
	- The program will play two notes.
	- You’ll see something like:

    ```
    Which interval was played? (Possible answers: e.g., '2m', '3', '5d', etc.)
    Or type 'r' to repeat the interval, 'menu' to return to main menu, 'exit' to quit >
    ```

	- Type one of the valid labels for that interval. For instance, if it’s a minor 3rd, valid labels might be 3m. If you’re not sure, type menu or exit to change modes or leave the quiz.

4. Continue or Stop:
	- After a certain number of rounds, you’ll be asked whether you want to continue, go to the main menu, or exit. You can keep training as long as you like.

## Quiz Modes

Here are the default modes:
1. **basic_single_octave**
	- Tests only the major scale intervals (2, 4, 5, 7, 9, 11, 12 semitones) within octave 4.
	- Good for beginners who want a narrower range.
2. **full_single_octave**
	- Tests all intervals from 1 to 12 semitones in octave 4.
	- Ideal for users who want to practice identifying any interval in a single octave.
3. **basic_multiple_octaves**
	- Same major-scale intervals, but randomly selects an octave between 3 and 5.
	- Adds a bit more realism by changing octave context.

You can easily add or customize these in the QUIZ_MODES dictionary in quiz.py.

## Contributing

1. Fork this repository.
2. Create a branch for your feature or bug fix:

```bash
git checkout -b feature/new-interval-mode
```

3. Commit your changes and push to your fork:

```bash
git commit -m "Add new interval mode for pentatonic scale"
git push origin feature/new-interval-mode
```

4. Open a Pull Request on the main [EarTrainer repository](https://github.com/MGallo-Code/EarTrainer) with a clear description of your changes.

## License

This project is licensed under the [MIT License](https://github.com/MGallo-Code/EarTrainer/blob/main/LICENSE). See the LICENSE file for details.

---

Thanks for checking out my project! If you have any questions or suggestions, feel free to open an issue or reach out.