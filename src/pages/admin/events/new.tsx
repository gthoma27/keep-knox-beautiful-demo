import React from "react";
import { NextPage, NextPageContext } from "next";
import UpsertEvent from "src/components/UpsertEvent";
import urls from "utils/urls";
import { getServerBaseUrl } from "utils/util";

const AddEventPage: NextPage = () => {
    return <UpsertEvent />;
};

// validate valid admin user
export async function getServerSideProps(context: NextPageContext) {
    try {
        const cookie = context.req?.headers.cookie;
        const response = await fetch(`${getServerBaseUrl(context.req)}${urls.api.validateLogin}`, {
            method: "POST",
            headers: {
                cookie: cookie || "",
            },
        });

        // redirect
        if (response.status !== 200) {
            context.res?.writeHead(302, {
                Location: urls.pages.login,
            });
            context.res?.end();
        }

        return {
            props: {},
        };
    } catch (error) {
        console.log(error);
    }
}
export default AddEventPage;
