export const HOST = "https://knockconsole.com";
// export const HOST = "http://127.0.0.1:8000";
export function JSONConfig(params = null) {
    return {
        headers: {
            "Authorization": localStorage.getItem("token") ? `JWT ${localStorage.getItem("token")}` : "",
            "Content-Type": "application/json"
        },
        params: params
    }
};

export function MultipartConfig(params = null) {
    return {
        headers: {
            // "Access-Control-Allow-Headers": "Content-Type Authorization",
            "Authorization": localStorage.getItem("token") ? `JWT ${localStorage.getItem("token")}` : "",
            "Content-Type": "multipart/form-data"
        },
        params: params
    }
}

export const thumbnailToItem = (thumbnail) => {
    return {
        image_size_type: thumbnail.image_size_type,
        image_type: thumbnail.image_type,
        width: thumbnail.width,
        height: thumbnail.height,
    }
}

export const contentToItem = (content) => {
    return {
        screen_size: content.screen_size,
        content_type: content.content_type,
        width: content.width,
        height: content.height,
    }
}

export const preloadContentToItem = (content) => {
    return {
        screen_size: content.screen_size,
        preload_type: content.preload_type,
        content_type: content.content_type,
        width: content.width,
        height: content.height,
    }
}