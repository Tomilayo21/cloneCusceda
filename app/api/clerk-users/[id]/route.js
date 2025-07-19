
import { NextResponse } from 'next/server'



const CLERK_API_BASE = 'https://api.clerk.com/v1/users'

export async function PATCH(req, context) {
  const { id } = context.params

  try {
    const { role } = await req.json()

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
    }

    const response = await fetch(`${CLERK_API_BASE}/${id}/metadata`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_metadata: { role } }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Clerk PATCH error:', errorText)
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  const { id } = context.params

  try {
    const response = await fetch(`${CLERK_API_BASE}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY || ''}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Clerk DELETE error:', errorText)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
