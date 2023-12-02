"use client"
import { ExpenseCategory } from "@prisma/client";
import React from "react";
import InputField from "../customs/input-field";
import MultiSelectField from "../customs/multi-select-field";
import { formatCategory } from "@/lib/utils";

const ExpenseFormFields: React.FC<{
  loading: boolean, expenseCategories: ExpenseCategory[], form: any
}> = ({ loading, expenseCategories, form }) => {
  return (
    <div className="grid md:grid-cols-3 md:gap-8 gap-4">
      <InputField name="title" placeholder="Title" disabled={loading} form={form} label="Title" />
      <InputField type="number" name="amount" placeholder="Amount Spent" disabled={loading} form={form} label="Amount spent" />
      {/* <SelectField name="category" placeholder="Category" data={expenseCategories} disabled={loading} form={form} label="Category" /> */}
      <MultiSelectField name="category" placeholder="Category" data={formatCategory(expenseCategories)} disabled={loading} form={form} label="Category"
      noMulti />

      <InputField name="reference" placeholder="Reference no e.g mpesa/ bank etc" disabled={loading} form={form} label="Reference No"  />
    </div>
  );
};

export default ExpenseFormFields;
