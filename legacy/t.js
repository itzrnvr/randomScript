curl 'https://ai-keyboard.com/api/openapi/turbo-stream' \
-X POST \
-H 'Host: ai-keyboard.com' \
-H 'User-Agent: KeyboardGPT/587 CFNetwork/1485 Darwin/23.1.0' \
-H 'Connection: keep-alive' \
-H 'Accept: application/json' \
-H 'Accept-Language: en-IN,en-GB;q=0.9,en;q=0.8' \
-H 'X-Encryption-Token: 2f17f2ac83d861a1435b64c1ca0f4c29' \
-H 'Content-Length: 644' \
-H 'Cache-Control: no-cache' \
-H 'Content-Type: application/json' \
--data-raw '{"messages":[{"content":"Give me 5 ideas to name a event planning agency","role":"user"},{"role":"assistant","content":"1. \"Eventful Moments\"\n2. \"Perfectly Planned\"\n3. \"Beyond Expectations Events\"\n4. \"Elevate Experiences\"\n5. \"Creative Curation Events\""},{"role":"user","content":"Can you suggest five creative names for an event organizing company?"},{"role":"assistant","content":"1. \"Enchanted Events\"\n2. \"Spectra Productions\"\n3. \"Celestial Affairs\"\n4. \"Harmony Experiences\"\n5. \"Epicurean Events\""},{"role":"user","content":"Event Solutions"}],"user":"2D267019-F702-4F30-95BA-774CF860FDE1","model":"gpt-3.5-turbo"}' \
--proxy http://localhost:9099

curl 'https://ai-keyboard.com/api/openapi/turbo' \
-X POST \
-H 'Host: ai-keyboard.com' \
-H 'User-Agent: KeyboardGPT/587 CFNetwork/1485 Darwin/23.1.0' \
-H 'Connection: keep-alive' \
-H 'Accept: application/json' \
-H 'Accept-Language: en-IN,en-GB;q=0.9,en;q=0.8' \
-H 'X-Encryption-Token: 2f17f2ac83d861a1435b64c1ca0f4c29' \
-H 'Content-Length: 163' \
-H 'Content-Type: application/json' \
--data-raw '{"messages":[{"role":"user","content":"Make 4 alternatives for the query: Event Solutions"}],"model":"gpt-3.5-turbo","user":"2D267019-F702-4F30-95BA-774CF860FDE1"}' \
--proxy http://localhost:9099