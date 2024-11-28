CREATE TABLE IF NOT EXISTS "question_has_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"answer_id" uuid NOT NULL,
	"is_answer" boolean DEFAULT false NOT NULL,
	CONSTRAINT "question_has_answers_question_id_answer_id_unique" UNIQUE("question_id","answer_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_has_answers" ADD CONSTRAINT "question_has_answers_question_id_cbt_module_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."cbt_module_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_has_answers" ADD CONSTRAINT "question_has_answers_answer_id_cbt_module_question_options_id_fk" FOREIGN KEY ("answer_id") REFERENCES "public"."cbt_module_question_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cbt_module_question_options" DROP COLUMN IF EXISTS "is_answer";