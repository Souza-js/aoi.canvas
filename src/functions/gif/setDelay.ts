import { AoiFunction, GIFManager, ParamType } from '../../';

export default new AoiFunction<"djs">({
    name: "$setDelay",
    description: "Sets the GIF display frame delay.",
    params: [
        {
            name: "gif",
            description: "Name of the GIF.",
            type: ParamType.String,
            check: (v, c) => !!(c.data.gifManager && c.data.gifManager instanceof GIFManager && c.data.gifManager.get(v)),
            checkError: () => "No GIF with provided name found.",
            optional: true
        },
        {
            name: "delay",
            description: "Number of milliseconds to display frame",
            type: ParamType.Number,
            check: (v) => v >= 0
        }
    ],
    code: async (ctx) => {
        const data = ctx.util.aoiFunc(ctx);
        let [ name, delay ] = ctx.params;

        try {
            if (!ctx.data.gifManager || !(ctx.data.gifManager instanceof GIFManager)) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF manager found.");
            }

            const gif = name 
                ? ctx.data.gifManager.get(name)
                : !name && ctx.data.gif 
                    ? ctx.data.gif[ctx.data.gif.length - 1] : null;
                    
            if (!gif) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "No GIF to set delay for.");
            }

            if (delay < 0) {
                return ctx.aoiError.fnError(ctx, "custom", {}, "Delay must be a positive number.");
            }

            await gif.setDelay(delay);
        } catch (error) {
            return ctx.aoiError.fnError(ctx, "custom", {}, "Failed to set GIF delay.");
        }

        return {
            code: ctx.util.setCode(data),
            data: ctx.data
        };
    }
});