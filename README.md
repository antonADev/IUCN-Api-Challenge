# IUCN Api Challenge

API - IUCN Red List of Threatened Species

1. Load the list of the available regions for species
2. Take a random region from the list
3. Load the list of all species in the selected region — the first page of the results would suffice, no need for pagination
4. Create a model for “Species” and map the results to an array of Species.
5. Filter the results for Critically Endangered species:
   • Fetch the conservation measures for all critically endangered species
   • Store the “title”-s of the response in the Species model as concatenated text property. • Print/display the results
6. Filter the results (from step 4) for the mammal class • Print/display the results


## Infos on how to run the app

- First add an .env file in the project directory.
- Inside the .env file add your API Token in a environment variable named VITE_IUCN_API_TOKEN
- Run an available script

### Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.
