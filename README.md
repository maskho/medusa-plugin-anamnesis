# medusa-plugin-anamnesis

`medusa-plugin-anamnesis` is a custom plugin for the Medusa backend, designed to extend its functionality. This plugin requires a pre-existing Medusa backend, which can be set up using the official documentation or through a new Medusa application installation.

## Prerequisites

Before you can install `medusa-plugin-anamnesis` locally, you need to have a Medusa backend already installed. You can set this up by following the instructions from the Medusa documentation:

- [Official Medusa Backend Installation Guide](https://docs.medusajs.com/development/backend/install)

Alternatively, you can create a new Medusa app using:

```bash
npx create-medusa-app@latest
```

## Installation

To install `medusa-plugin-anamnesis`, follow these steps:

1.  **Clone the Repository**  
    Start by cloning the repository to your local machine:

    ```bash
    git clone https://github.com/maskho/medusa-plugin-anamnesis.git
    cd medusa-plugin-anamnesis`
    ```

2.  **Install Dependencies**
    Install the necessary dependencies:

    ```bash
    npm install
    ```

3.  **Prepare the Plugin**  
    Prepare the plugin for integration:

    ```bash
    npm run prepare
    ```

4.  **Link the Plugin**
    Create a symbolic link within the plugin directory:

    ```bash
    npm link
    ```

    Then, link it within your Medusa backend directory:

    ```bash
    npm link medusa-plugin-anamnesis
    ```

5.  **Configure the Plugin**
    Add the plugin to your `medusa-config.js` with the necessary options:

    ```javascript
    const  plugins  = [
        // Other plugins,
    `	{
            resolve: "medusa-plugin-anamnesis",
            options: {
                enableUI: true
            }
        }
    ]
    ```

6.  **Handle Dependency Errors**
    To prevent any dependency conflicts, remove the Medusa core from the plugin's `node_modules`:

    ```bash
    rm -rf node_modules/medusa-plugin-anamnesis/node_modules/@medusajs/medusa
    ```

7.  **Run Migrations**
    Execute required migrations:

    ```bash
    npx medusa migrations run
    ```

8.  **Start Development Server**  
    Finally, launch your development server with symlink preservation:

    ```bash
    npm run dev -- --preserve-symlinks
    ```

## Usage

With `medusa-plugin-anamnesis` installed, you can start your Medusa backend to take advantage of the anamnesis form features provided by the plugin.

## API Documentation

To explore the API documentation for `medusa-plugin-anamnesis`, please visit our Postman documentation:

[View API Documentation on Postman](https://documenter.getpostman.com/view/36013532/2sA3s3GAYq)

This documentation provides detailed instructions and interactive examples for using the APIs provided by the `medusa-plugin-anamnesis`. It's an excellent resource for understanding how to integrate and utilize the plugin effectively within your Medusa backend.

## Support

Contact syeh.ak@gmail.com for issues.
