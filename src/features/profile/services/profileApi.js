import axios from "axios";

import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE =
    import.meta.env.VITE_API_BASE;

// ======================
// GET PROFILE
// ======================

export const getProfile =
    async () => {

        const session =
            await fetchAuthSession();

        const token =
            session.tokens
                ?.accessToken
                ?.toString();

        const res =
            await axios.post(

                `${API_BASE}/profile/crud`,

                {
                    action:
                        "GET_PROFILE",
                },

                {
                    headers: {
                        Authorization:
                            token,
                    },
                }
            );

        return res.data;
    };

// ======================
// UPDATE PROFILE
// ======================

export const updateProfile =
    async ({
        firstname,
        lastname,

        phone_number,

        address,

        bio,

        company,

        job_title,

        timezone,
    }) => {

        const session =
            await fetchAuthSession();

        const token =
            session.tokens
                ?.accessToken
                ?.toString();

        const res =
            await axios.post(

                `${API_BASE}/profile/crud`,

                {
                    action:
                        "UPDATE_PROFILE",

                    firstname,

                    lastname,

                    phone_number,

                    address,

                    bio,

                    company,

                    job_title,

                    timezone,
                },

                {
                    headers: {
                        Authorization:
                            token,
                    },
                }
            );

        return res.data;
    };

// ======================
// GENERATE PROFILE
// IMAGE UPLOAD URL
// ======================

export const generateProfileUploadUrl =
    async () => {

        const session =
            await fetchAuthSession();

        const token =
            session.tokens
                ?.accessToken
                ?.toString();

        const res =
            await axios.post(

                `${API_BASE}/profile/crud`,

                {
                    action:
                        "GENERATE_PROFILE_UPLOAD_URL",
                },

                {
                    headers: {
                        Authorization:
                            token,
                    },
                }
            );

        return res.data;
    };

// ======================
// SAVE PROFILE PHOTO
// ======================

export const saveProfilePhoto =
    async (
        image_url
    ) => {

        const session =
            await fetchAuthSession();

        const token =
            session.tokens
                ?.accessToken
                ?.toString();

        const res =
            await axios.post(

                `${API_BASE}/profile/crud`,

                {
                    action:
                        "SAVE_PROFILE_PHOTO",

                    image_url,
                },

                {
                    headers: {
                        Authorization:
                            token,
                    },
                }
            );

        return res.data;
    };

// ======================
// UPLOAD IMAGE TO S3
// ======================

export const uploadProfilePhoto =
    async (
        uploadUrl,
        file
    ) => {

        await axios.put(
            uploadUrl,

            file,

            {
                headers: {
                    "Content-Type":
                        file.type,
                },
            }
        );
    };

export const removeProfilePhoto =
    async () => {

        const session =
            await fetchAuthSession();

        const token =
            session.tokens
                ?.accessToken
                ?.toString();

        const res =
            await axios.post(

                `${API_BASE}/profile/crud`,

                {
                    action:
                        "REMOVE_PROFILE_PHOTO",
                },

                {
                    headers: {
                        Authorization:
                            token,
                    },
                }
            );

        return res.data;
    };