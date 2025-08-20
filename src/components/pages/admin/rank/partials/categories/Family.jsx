import React from 'react'

export const Family = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-medium">Family</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>        
    </div>
  )
}
