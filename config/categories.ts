interface Category {
    value: string
    label: string
    type: 'income' | 'expense' | 'both'
}

export const categories: Category[] = [
    // Income Categories
    {
        value: 'salary',
        label: 'Salary',
        type: 'income'
    },
    {
        value: 'freelance',
        label: 'Freelance',
        type: 'income'
    },
    {
        value: 'investments',
        label: 'Investments',
        type: 'income'
    },
    {
        value: 'rental',
        label: 'Rental Income',
        type: 'income'
    },
    {
        value: 'other-income',
        label: 'Other Income',
        type: 'income'
    },

    // Expense Categories
    {
        value: 'housing',
        label: 'Housing',
        type: 'expense'
    },
    {
        value: 'transportation',
        label: 'Transportation',
        type: 'expense'
    },
    {
        value: 'food',
        label: 'Food & Dining',
        type: 'expense'
    },
    {
        value: 'utilities',
        label: 'Utilities',
        type: 'expense'
    },
    {
        value: 'insurance',
        label: 'Insurance',
        type: 'expense'
    },
    {
        value: 'healthcare',
        label: 'Healthcare',
        type: 'expense'
    },
    {
        value: 'entertainment',
        label: 'Entertainment',
        type: 'expense'
    },
    {
        value: 'shopping',
        label: 'Shopping',
        type: 'expense'
    },
    {
        value: 'education',
        label: 'Education',
        type: 'expense'
    },
    {
        value: 'other-expense',
        label: 'Other Expense',
        type: 'expense'
    }
]

export function getCategoriesByType(type: 'income' | 'expense'): Category[] {
    return categories.filter(category =>
        category.type === type || category.type === 'both'
    )
} 