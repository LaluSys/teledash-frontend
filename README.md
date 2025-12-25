# Teledash Frontend - Custom Fork

This is a fork of the [ARAI-Telegram Teledash Frontend](https://github.com/ARAI-Telegram/teledash-frontend) with enhanced text analysis features.

## ⚠️ Disclaimer

**This fork is experimental and under active development. Use at your own risk.**

This custom fork includes features that are:
- Not fully tested in production environments
- Subject to breaking changes without notice
- Potentially unstable or incomplete
- Not officially supported by the ARAI-Telegram team

**For production use, consider the official [ARAI-Telegram repositories](https://github.com/ARAI-Telegram).**

## Custom Features Added

This fork extends the original Teledash with comprehensive scientific text analysis capabilities:

### Analysis Features
- **N-grams Explorer**: Extract and visualize frequent word patterns (unigrams, bigrams, trigrams) with configurable stopword filtering and minimum frequency thresholds
- **Sentiment Analysis Dashboard**: Real-time sentiment classification with per-chat breakdowns, timeline visualization, and confidence scoring
- **Named Entity Recognition (NER)**: Identify and extract persons, organizations, locations, and other entities with network visualization of entity relationships
- **Topic Modeling**: Discover latent topics using Structural Topic Models (STM) with interactive network graphs and topic-document associations

### Shared Components
- **ChatMultiSelect**: Reusable component for consistent chat selection across all analysis features with search and select-all functionality
- **DateRangeFilter**: Unified date range picker for temporal filtering across all analysis types
- **ML Processing Status Monitor**: Real-time monitoring of background ML processing tasks

### Why These Features?
These enhancements enable researchers to:
- Apply **scientific rigor** to Telegram data analysis with configurable parameters
- Maintain **consistency** across different analysis types through shared components
- **Filter and segment** data by chat and time period for focused analysis
- **Visualize patterns** in text data through multiple complementary methods
- **Monitor processing** of large datasets with real-time status updates

The scientific filtering capabilities (chat selection, date ranges, frequency thresholds) ensure reproducible research workflows.

## Credits

This fork is based on the excellent work of the [ARAI-Telegram team](https://github.com/ARAI-Telegram). All core functionality for monitoring and analyzing anti-democratic content on Telegram is their contribution.

**Original Project**: [ARAI-Telegram/teledash-frontend](https://github.com/ARAI-Telegram/teledash-frontend)

---

# Original README

## About Teledash

Teledash is an open-source software for monitoring and analyzing anti-democratic content on Telegram channels and groups.

It consists of three separate repositories:

- Frontend (this repository) - Web interface
- [Backend](https://github.com/ARAI-Telegram/teledash-backend) - Core API and worker services for data collection and management. See here for more information on Teledash in general
- [Processing Backend](https://github.com/ARAI-Telegram/teledash-backend-processing) (optional) - ML-powered services (semantic search, transcription, classification)

> **For a more comprehensive overview of the Teledash project** (architecture, functionalities), please refer to the [Backend repository README](https://github.com/ARAI-Telegram/teledash-backend#readme).

# Teledash Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
It's based on [this boilerplate](https://github.com/alan2207/bulletproof-react/) (forked 08.01.2022)

## Development

### `npm install`

Installs all required Node modules listed in package.json.

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode. See the section about [running tests](https://create-react-app.dev/docs/running-tests/) for more information.

### Generate Typescript types from OpenAPI schema
`npm run generate-api-types` or \
`npx openapi-typescript http://localhost:8000/openapi.json --output src/types/api.ts`

## Deployment

### `npm install`

Installs all required Node modules listed in package.json.

### `npm run build`

Builds the app for production to the `build` folder. It bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

Make sure to change the *.env* file and set `VITE_API_URL` accordingly (e.g. to `api.example.com:3000`).

See [deployment](https://create-react-app.dev/docs/deployment/) for more information on continuous deployment and hosting options.


## Funding

![DATIpilot Logo](./logoDATIpilot.png)
