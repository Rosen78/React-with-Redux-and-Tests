/**
 * Created by Rosen_Nikolov on 12/5/2016.
 */

export default {
    categoriesInfo: {
        currentStateIndex: 0,
        lastStateIndex: 0,
        mode: [{stateIndex: 0, info: 'selectedCategory'}],//selectedItem or selectedCategory
        categoriesAndItems: [
            {
                ID: 1,
                deleted: [{stateIndex: 0, info: false}],
                name: [{stateIndex: 0, info: 'Category 1'}],
                nestLevel: 0,
                subCategories: [],
                opened: [{stateIndex: 0, info: false}],
                selected: [{stateIndex: 0, info: false}],
                items: []
            },
            {
                ID: 2,
                deleted: [{stateIndex: 0, info: false}],
                name: [{stateIndex: 0, info: 'Category 2'}],
                nestLevel: 0,
                subCategories: [],
                opened: [{stateIndex: 0, info: false}],
                selected: [{stateIndex: 0, info: false}],
                items: []
            },
            {
                ID: 3,
                deleted: [{stateIndex: 0, info: false}],
                name: [{stateIndex: 0, info: 'Category 3'}],
                nestLevel: 0,
                subCategories: [
                    {
                        ID: 4,
                        deleted: [{stateIndex: 0, info: false}],
                        name: [{stateIndex: 0, info: 'Category 3 1'}],
                        nestLevel: 1,
                        subCategories: [],
                        opened: [{stateIndex: 0, info: false}],
                        selected: [{stateIndex: 0, info: false}],
                        items: []
                    },
                    {
                        ID: 5,
                        deleted: [{stateIndex: 0, info: false}],
                        name: [{stateIndex: 0, info: 'Category 3 2'}],
                        nestLevel: 1,
                        subCategories: [],
                        opened: [{stateIndex: 0, info: false}],
                        selected: [{stateIndex: 0, info: false}],
                        items: []
                    },
                    {
                        ID: 6,
                        deleted: [{stateIndex: 0, info: false}],
                        name: [{stateIndex: 0, info: 'Category 3 3'}],
                        nestLevel: 1,
                        subCategories: [],
                        opened: [{stateIndex: 0, info: false}],
                        selected: [{stateIndex: 0, info: false}],
                        items: []
                    }
                ],
                opened: [{stateIndex: 0, info: true}],
                selected: [{stateIndex: 0, info: true}],
                items: [
                    {
                        ID: 1,
                        deleted: [{stateIndex: 0, info: false}],
                        oldCategoryID: [{stateIndex: 0, info: 3}],
                        oldPositionFromEnd: [{stateIndex: 0, info: 4}],
                        name: [{stateIndex: 0, info: 'TO-Do Item #1'}],
                        done: [{stateIndex: 0, info: false}],
                        description: [{stateIndex: 0, info: ''}]
                    },
                    {
                        ID: 2,
                        deleted: [{stateIndex: 0, info: false}],
                        oldCategoryID: [{stateIndex: 0, info: 3}],
                        oldPositionFromEnd: [{stateIndex: 0, info: 3}],
                        name: [{stateIndex: 0, info: 'TO-Do Item #2'}],
                        done: [{stateIndex: 0, info: true}],
                        description: [{stateIndex: 0, info: ''}]
                    },
                    {
                        ID: 3,
                        deleted: [{stateIndex: 0, info: false}],
                        oldCategoryID: [{stateIndex: 0, info: 3}],
                        oldPositionFromEnd: [{stateIndex: 0, info: 2}],
                        name: [{stateIndex: 0, info: 'TO-Do Item #3'}],
                        done: [{stateIndex: 0, info: true}],
                        description: [{stateIndex: 0, info: ''}]
                    },
                    {
                        ID: 4,
                        deleted: [{stateIndex: 0, info: false}],
                        oldCategoryID: [{stateIndex: 0, info: 3}],
                        oldPositionFromEnd: [{stateIndex: 0, info: 1}],
                        name: [{stateIndex: 0, info: 'TO-Do Item #4'}],
                        done: [{stateIndex: 0, info: true}],
                        description: [{stateIndex: 0, info: ''}]
                    },
                    {
                        ID: 5,
                        deleted: [{stateIndex: 0, info: false}],
                        oldCategoryID: [{stateIndex: 0, info: 3}],
                        oldPositionFromEnd: [{stateIndex: 0, info: 0}],
                        name: [{stateIndex: 0, info: 'TO-Do Item #5'}],
                        done: [{stateIndex: 0, info: true}],
                        description: [{stateIndex: 0, info: ''}]
                    }
                ]
            }
        ],
        addItemError: [{stateIndex: 0, info: ''}],
        itemsFilter: {
            status: [{stateIndex: 0, info: false}],
            text: [{stateIndex: 0, info: ''}]
        },
        editedItemId: [{stateIndex: 0, info: undefined}],
        noCategorySelected: [{stateIndex: 0, info: false}]
    }
};
