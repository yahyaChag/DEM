import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cardNumber, amount } = body;

    // Faux delay to simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple mock validation (Stripe's test card)
    if (cardNumber === '4242424242424242') {
      return NextResponse.json({ success: true, transactionId: `txn_${Date.now()}` });
    } else {
      return NextResponse.json(
        { success: false, error: "Paiement refusé. Veuillez vérifier votre carte." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur de paiement" }, { status: 500 });
  }
}
