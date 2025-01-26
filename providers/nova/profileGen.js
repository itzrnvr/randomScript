const axios = require("axios");
const uuid = require("uuid");

const DEVICE = "iPad8,6";
const APP_VERSION = "1.8.9";
const OS = "16.5";
const PLATFORM = "iPadOS";

const TIMEZONES = ["Asia/Kolkata", "America/New_York", "Europe/London"];
const LOCALES = ["en-IN", "en-US", "en-GB"];
const COUNTRIES = ["IND", "USA", "GBR"];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generatePayloadAndConfig() {
    const SDK_PROFILE_ID = uuid.v4();
    const SDK_SESSION_ID = uuid.v4();
    const DEVICE_ID = uuid.v4();
    const IDFV = uuid.v4();

    const cryptoRandomString = (await import("crypto-random-string")).default;

    const CUSTOMER_USER_ID = cryptoRandomString({ length: 32 });

    const TIMEZONE = getRandomElement(TIMEZONES);
    const LOCALE = getRandomElement(LOCALES);
    const COUNTRY = getRandomElement(COUNTRIES);

    let data = JSON.stringify({
        data: {
            type: "adapty_analytics_profile",
            id: SDK_PROFILE_ID,
            attributes: {
                att_status: 0,
                installation_meta: {
                    device: DEVICE,
                    app_version: APP_VERSION,
                    os: OS,
                    device_id: DEVICE_ID,
                    adapty_sdk_version: "2.6.3",
                    platform: PLATFORM,
                    app_build: "81",
                    locale: LOCALE,
                    timezone: TIMEZONE,
                    idfv: IDFV,
                    idfa: "00000000-0000-0000-0000-000000000000",
                },
                analytics_disabled: false,
                customer_user_id: CUSTOMER_USER_ID,
                store_country: COUNTRY,
            },
        },
    });

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://api.adapty.io/api/v1/sdk/analytics/profiles/${SDK_PROFILE_ID}/`,
        headers: {
            Host: "api.adapty.io",
            "Content-Type": "application/json, application/vnd.api+json",
            Authorization: "Api-Key public_live_xHMz04gr.Sat4TIJWTRZ4LBXVnMCn",
            Accept: "*/*",
            "adapty-sdk-sandbox-mode-enabled": "false",
            "adapty-sdk-observer-mode-enabled": "false",
            "adapty-app-version": "1.8.9",
            "adapty-sdk-device-id": DEVICE_ID,
            "adapty-sdk-version": "2.6.3",
            "adapty-sdk-profile-id": SDK_PROFILE_ID,
            "adapty-sdk-session": SDK_SESSION_ID,
            "Accept-Language": LOCALE,
            "adapty-sdk-platform": PLATFORM,
            "adapty-sdk-storekit2-enabled": "disabled",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "User-Agent": "ChatAI/81 CFNetwork/1408.0.4 Darwin/22.5.0",
            "Content-Type": "application/vnd.api+json",
        },
        data: data,
    };

    return config;
}

const getNewUser = async () => {
    let config = await generatePayloadAndConfig();
    const response = await axios.request(config);
    const userID = response.data.data.attributes.customer_user_id;
    return userID;
};

module.exports = { getNewUser };
