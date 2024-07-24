import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'mentee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    if (task.status !== 'open') {
      return NextResponse.json({ success: false, error: 'Task is not open for applications' }, { status: 400 });
    }

    task.mentee = session.user.id;
    task.status = 'in_progress';
    await task.save();

    return NextResponse.json({ success: true, data: task });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 400 });
  }
}