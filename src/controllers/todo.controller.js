import AsyncHandler from "../utils/AsyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ResponseHandler from "../utils/ResponseHandler.js";
import Todo from "../models/todo.model.js"

const createTodo = AsyncHandler(async (req, res) => {
    const { todoText } = req.body
    const createdBy = req?.user?._id

    if (!todoText) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo text is required!")
        )
    }

    if (todoText?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo text shouldn't be empty!")
        )
    }

    const isTodoCreated = await Todo.findOne({
        $and: [
            { todoText: todoText?.trim() },
            { createdBy }
        ]
    })

    if (isTodoCreated) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo already exists!")
        )
    }

    const todo = await Todo.create({
        todoText: todoText?.trim(),
        createdBy: createdBy
    })

    const createdTodo = await Todo.findById(todo?._id)

    if (!createdTodo) {
        return res
        .status(500)
        .json(
            new ErrorHandler(500, "Something went wrong while creating the todo!")
        )
    }

    return res
    .status(201)
    .json(
        new ResponseHandler(200, createdTodo, "Todo created successfully")
    )
})

const listAllTodo = AsyncHandler(async (req, res) => {
    const todos = await Todo.find({
        createdBy: req?.user?._id
    })

    if (!todos) {
        return res
        .status(500)
        .json(
            new ErrorHandler(500, "No todos found!")
        )
    }

    return res
    .status(200)
    .json(
        new ResponseHandler(200, todos, "Todos fetched successfully!")
    )
})

const deleteTodo = AsyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo id is required!")
        )
    }

    await Todo.findByIdAndDelete(_id)

    return res
    .status(200)
    .json(
        new ResponseHandler(200, {}, "Todo deleted successfully!")
    )
})

const updateTodo = AsyncHandler(async (req, res) => {
    const { todoText, _id } = req.body

    if (!_id || !todoText) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo id and todo text is required!")
        )
    }

    if (todoText?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo text shouldn't be empty!")
        )
    }

    const isTodoPresent = await Todo.findOne({ _id })

    if (!isTodoPresent) {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo not found!")
        )
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        _id,
        {
            $set: {
                todoText: todoText?.trim()
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ResponseHandler(200, updatedTodo, "Todo updated successfully!")
    )
})

const toggleStatus = AsyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id || _id?.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandler(400, "Todo id is required!")
        )
    }

    const todo = await Todo.findById(_id)

    const updatedStatus = await Todo.findByIdAndUpdate(
        _id,
        {
            $set: {
                isCompleted: !todo.isCompleted
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ResponseHandler(200, updatedStatus, "Todo status updated successfully!")
    )
})

export {
    createTodo,
    listAllTodo,
    deleteTodo,
    updateTodo,
    toggleStatus
}