const Lead =
    require("../models/lead.model");

exports.getReports =
    async (req, res) => {

        try {

            const {
                source,
                stage,
                search,
            } = req.query;

            const query = {};

            // SOURCE

            if (
                source &&
                source !== "all"
            ) {

                query.source = source;
            }

            // STAGE

            if (
                stage &&
                stage !== "all"
            ) {

                query.stage = stage
                    .toLowerCase()
                    .replace(/ /g, "_");
            }

            // SEARCH

            if (search) {

                query.name = {

                    $regex: search,

                    $options: "i",
                };
            }

            const leads =
                await Lead.find(query)

                    .populate(
                        "ownerId",
                        "name email role"
                    )

                    .sort({
                        createdAt: -1,
                    });

            // NORMALIZE DATA

            const reports =
                leads.map((lead) => ({

                    _id:
                        lead._id,

                    name:
                        lead.name,

                    source:
                        lead.source,

                    stage:
                        lead.stage
                            .replace(/_/g, " ")
                            .replace(
                                /\b\w/g,
                                (c) =>
                                    c.toUpperCase()
                            ),

                    ownerId:
                        lead.ownerId,

                    createdAt:
                        lead.createdAt,

                    dealValue:
                        lead.dealValue || 0,
                }));

            res.json({
                reports,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message:
                    error.message,
            });
        }
    };