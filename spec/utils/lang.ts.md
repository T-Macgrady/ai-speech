## utils/lang.ts

The `utils/lang.ts` file is responsible for providing utility functions related to language processing.

### Functions

#### `getLanguageCode(language: string): string`

This function takes a `language` parameter and returns the corresponding language code. It is used to convert a language name into its ISO 639-1 language code.

**Parameters:**

- `language` (string): The name of the language.

**Returns:**

- `string`: The ISO 639-1 language code.

**Example:**

```typescript
const languageCode = getLanguageCode('English');
console.log(languageCode); // Output: 'en'
```

#### `getLanguageName(languageCode: string): string`

This function takes a `languageCode` parameter and returns the corresponding language name. It is used to convert an ISO 639-1 language code into its language name.

**Parameters:**

- `languageCode` (string): The ISO 639-1 language code.

**Returns:**

- `string`: The name of the language.

**Example:**

```typescript
const languageName = getLanguageName('en');
console.log(languageName); // Output: 'English'
```

#### `getSupportedLanguages(): string[]`

This function returns an array of supported language names. It is used to retrieve the list of languages supported by the application.

**Returns:**

- `string[]`: An array of supported language names.

**Example:**

```typescript
const supportedLanguages = getSupportedLanguages();
console.log(supportedLanguages); // Output: ['English', 'Spanish', 'French']
```

### Constants

#### `SUPPORTED_LANGUAGES`

This constant is an array of supported language names. It is used to define the list of languages supported by the application.

**Example:**

```typescript
const supportedLanguages = ['English', 'Spanish', 'French'];
```

### Usage

```typescript
import {
  getLanguageCode,
  getLanguageName,
  getSupportedLanguages,
} from './lang';

const languageCode = getLanguageCode('English');
console.log(languageCode); // Output: 'en'

const languageName = getLanguageName('en');
console.log(languageName); // Output: 'English'

const supportedLanguages = getSupportedLanguages();
console.log(supportedLanguages); // Output: ['English', 'Spanish', 'French']
```

Please note that the above code is just an example and may need to be adapted to fit your specific use case.
