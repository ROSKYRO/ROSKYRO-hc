1. Put these 3 files in PROJECT ROOT (same folder as package.json):
   - railway.toml   (replace old one)
   - .nvmrc
   - .node-version

2. package.json me "type": "module", ke baad add karo:
   "engines": {
     "node": ">=20"
   },

3. Railway → Variables me ADD karo:
   NIXPACKS_NODE_VERSION = 20

4. Redeploy
